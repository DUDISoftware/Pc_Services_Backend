/* eslint-disable no-prototype-builtins */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
import { redisClient } from '~/config/redis.js'
import mongoose from 'mongoose'
import DiscountModel from '~/models/Discount.model.js'
import ExcelJS from 'exceljs'

// ========================= Helpers =========================

// ============ SERVICE AGGREGATION BASE ============= //
const serviceAggregationBase = [
  // Join ratings
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'service_id',
      as: 'ratings'
    }
  },

  // Join latest service-specific discount
  {
    $lookup: {
      from: 'discounts',
      let: { serviceId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$service_id', '$$serviceId'] } } },
        { $sort: { updatedAt: -1 } },
        { $limit: 1 }
      ],
      as: 'service_discount'
    }
  },

  // Join service category
  {
    $lookup: {
      from: 'service_categories', // hoặc 'categories' nếu bạn dùng chung
      localField: 'category_id',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

  // Join latest category discount
  {
    $lookup: {
      from: 'discounts',
      let: { catId: '$category_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$service_category_id', '$$catId'] } } },
        { $sort: { updatedAt: -1 } },
        { $limit: 1 }
      ],
      as: 'category_discount'
    }
  },

  // Override logic
  {
    $addFields: {
      avg_rating: {
        $cond: [
          { $gt: [{ $size: '$ratings' }, 0] },
          { $avg: '$ratings.score' },
          0
        ]
      },
      rating_count: { $size: '$ratings' },

      sale_off: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
          { $ifNull: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, 0] }
        ]
      },

      start_date: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $arrayElemAt: ['$category_discount.start_date', 0] },
          { $arrayElemAt: ['$service_discount.start_date', 0] }
        ]
      },

      end_date: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$service_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $arrayElemAt: ['$category_discount.end_date', 0] },
          { $arrayElemAt: ['$service_discount.end_date', 0] }
        ]
      }
    }
  },

  // final_price = price * (100 - sale_off)/100
  {
    $addFields: {
      final_price: {
        $round: [
          {
            $multiply: [
              '$price',
              {
                $divide: [
                  { $subtract: [100, '$sale_off'] },
                  100
                ]
              }
            ]
          },
          0
        ]
      }
    }
  },

  {
    $project: {
      ratings: 0,
      service_discount: 0,
      category_discount: 0
    }
  }
]

// ========================== Service Services ==========================
/**
 * Creates a new service with the provided data and images.
 * Saves the service to the database and populates its category information.
 *
 * @param {Object} reqBody - The request body containing service data.
 * @param {Array} files - Array of image files to associate with the service.
 * @returns {Promise<Object>} - The created service object with populated category.
 * @throws {ApiError} - Throws an error if service creation fails.
 */
const createService = async (reqBody, files) => {
  try {
    const { category_id, ...rest } = reqBody
    const images = files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || []
    const service = new ServiceModel({
      ...rest,
      category_id: category_id || null,
      images
    })
    await service.save()
    return service.populate('category_id', 'name')
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates an existing service by ID with new data and images.
 * Returns the updated service with populated category information.
 *
 * @param {string} id - The ID of the service to update.
 * @param {Object} reqBody - The request body containing updated service data.
 * @param {Array} files - Array of new image files to associate with the service.
 * @returns {Promise<Object>} - The updated service object.
 * @throws {ApiError} - Throws an error if service update fails or service not found.
 */
const updateService = async (id, reqBody, files) => {
  try {
    const updateData = { ...reqBody, updatedAt: Date.now() }
    if (files?.length) {
      updateData.images = files.map(file => ({
        url: file.path,
        public_id: file.filename
      }))
    }
    const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
      new: true
    }).populate('category_id', 'name')
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Hides a service by setting its status to 'hidden'.
 *
 * @param {string} id - The ID of the service to hide.
 * @returns {Promise<Object>} - The updated service object.
 * @throws {ApiError} - Throws an error if service not found or update fails.
 */
const hideService = async (id) => {
  try {
    const service = await ServiceModel.findById(id)
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    service.status = 'hidden'
    await service.save()
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves all services matching the provided filter.
 * Populates category information and sorts by creation date descending.
 *
 * @param {Object} [filter={}] - Filter criteria for services.
 * @returns {Promise<Array>} - Array of service objects.
 * @throws {ApiError} - Throws an error if retrieval fails.
 */
const getAllServices = async (limit = 10, page = 1, filter = {}, fields = '', order = { created_at: -1 }) => {
  try {
    limit = parseInt(limit, 10)
    page = parseInt(page, 10)
    const pipeline = [
      { $match: filter },
      ...serviceAggregationBase,
      { $sort: order },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]

    // Nếu có field cụ thể → apply $project
    if ((Array.isArray(fields) && fields.length && fields[0] !== '') || (typeof fields === 'string' && fields.trim() !== '')) {
      const fieldList = Array.isArray(fields) ? fields : fields.trim().split(/\s+/)
      const fieldObj = Object.fromEntries(fieldList.map(f => [f, 1]))
      pipeline.push({
        $project: {
          ...fieldObj,
          avg_rating: 1,
          rating_count: 1,
          sale_off: 1,
          final_price: 1,
          category: 1
        }
      })
    }

    const services = await ServiceModel.aggregate(pipeline)

    const total = await ServiceModel.countDocuments(filter)

    return {
      status: 'success',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      services
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a service by its ID.
 * Populates category information.
 *
 * @param {string} id - The ID of the service to retrieve.
 * @returns {Promise<Object>} - The service object.
 * @throws {ApiError} - Throws an error if service not found or retrieval fails.
 */
const getServiceById = async (id) => {
  try {
    const objectId = new mongoose.Types.ObjectId(id)
    const pipeline = [
      { $match: { _id: objectId } },
      ...serviceAggregationBase
    ]

    const result = await ServiceModel.aggregate(pipeline)

    if (!result || result.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    }

    return result[0]
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


/**
 * Retrieves a service by its slug.
 * Populates category information.
 *
 * @param {string} slug - The slug of the service to retrieve.
 * @returns {Promise<Object>} - The service object.
 * @throws {ApiError} - Throws an error if service not found or retrieval fails.
 */
const getServiceBySlug = async (slug) => {
  try {
    const pipeline = [
      { $match: { slug } },
      ...serviceAggregationBase
    ]

    const result = await ServiceModel.aggregate(pipeline)

    if (!result || result.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    }

    return result[0]
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


/**
 * Deletes a service by its ID.
 *
 * @param {string} id - The ID of the service to delete.
 * @returns {Promise<Object>} - The deleted service object.
 * @throws {ApiError} - Throws an error if service not found or deletion fails.
 */
const deleteService = async (id) => {
  try {
    const service = await ServiceModel.findByIdAndDelete(id)
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves the most viewed featured services from Redis.
 * A featured service is determined by the highest view count stored under keys matching 'service:*:views'.
 * Scans Redis for all matching keys, fetches their view counts, sorts them in descending order,
 * and returns the top services up to the specified limit.
 *
 * @param {number} [limit=4] - The maximum number of featured services to return.
 * @returns {Promise<Array<{id: string, views: number}>>} - A promise that resolves to an array of featured service objects.
 * @throws {ApiError} - Throws an error if there is a problem accessing Redis or processing the data.
 */
const getFeaturedServices = async (limit = 4) => {
  try {
    let keys = []
    let cursor = '0'
    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: 'service:*:views',
        COUNT: 10
      })
      cursor = reply.cursor
      keys = keys.concat(reply.keys)
    } while (cursor !== '0')

    if (keys.length === 0) return []

    const values = await redisClient.mGet(keys)

    const featured = keys.map((key, i) => {
      const id = key.split(':')[1]
      const views = values[i] ? parseInt(values[i], 10) : 0
      return { id, views }
    })

    featured.sort((a, b) => b.views - a.views)

    const topIds = featured.slice(0, limit).map(f => new mongoose.Types.ObjectId(f.id))

    const services = await ServiceModel.aggregate([
      { $match: { _id: { $in: topIds } } },
      ...serviceAggregationBase
    ])

    // Optional: gắn `views` vào từng service
    const servicesWithViews = services.map(s => {
      const viewObj = featured.find(f => f.id === s._id.toString())
      return { ...s, views: viewObj?.views || 0 }
    })

    return servicesWithViews
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves the view count for a specific service from Redis.
 *
 * @param {string} id - The ID of the service.
 * @returns {Promise<number>} - The number of views for the service.
 * @throws {ApiError} - Throws an error if retrieval fails.
 */
const getServiceViews = async (id) => {
  try {
    const key = `service:${id}:views`
    const views = await redisClient.get(key)
    return views ? parseInt(views, 10) : 0
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Increments the view count for a specific service in Redis.
 * Sets the expiration for the view count key to 7 days.
 *
 * @param {string} id - The ID of the service.
 * @returns {Promise<number>} - The updated number of views for the service.
 * @throws {ApiError} - Throws an error if increment fails.
 */
const countViewRedis = async (id) => {
  try {
    const key = `service:${id}:views`
    const views = await redisClient.incrBy(key, 1)
    await redisClient.expire(key, 60 * 60 * 24 * 7)
    return views
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
// excel

const exportServicesToExcel = async () => {
  const customersService = await ServiceModel.find()
  .populate('category_id', 'name slug') 
  .sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('customersService');

  worksheet.columns = [
    { header: 'Tên dịch vụ', key: 'name', width: 30 },
    { header: 'Mô tả', key: 'description', width: 40 },
    { header: 'Giá', key: 'price', width: 15 },
    { header: 'Danh mục', key: 'category', width: 25 },
    { header: 'Trạng thái', key: 'status', width: 15 },

  ];
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 12 }; 
    cell.alignment = { horizontal: 'center', vertical: 'middle' }; 
    cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFDCE6F1' } 
  };
  cell.border = {                 
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
});

  const statusMap = {
    active: 'Đã mở',
    inactive: 'Chưa mở',
    hidden: 'Đã ẩn',
  };

  customersService.forEach((customersService) => {
  const statusText = statusMap[customersService.status] || 'Không xác định';

    worksheet.addRow({
      name: customersService.name,
      description: customersService.description,
      price: customersService.price,
      category: customersService.category_id?.name || '',
      status: statusText,
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const exportServicesToExcel = async () => {
  const customersService = await ServiceModel.find()
    .populate('category_id', 'name slug')
    .sort({ createdAt: -1 })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('customersService')

  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 5 },
    { header: 'Tên dịch vụ', key: 'name', width: 30 },
    { header: 'Mô tả', key: 'description', width: 40 },
    { header: 'Giá', key: 'price', width: 15 },
    { header: 'Giảm giá', key: 'discount', width: 15 },
    { header: 'Giá đã giảm', key: 'salePrice', width: 15 },
    { header: 'Danh mục', key: 'category', width: 25 },
    { header: 'Trạng thái', key: 'status', width: 15 }

  ]
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, size: 12 }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCE6F1' }
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })

  const statusMap = {
    active: 'Đã mở',
    inactive: 'Chưa mở',
    hidden: 'Đã ẩn'
  }

  for (let index = 0; index < customersService.length; index++) {
    const service = customersService[index]
    const statusText = statusMap[service.status] || 'Không xác định'
    const saleOffValue = await DiscountModel.findOne({ service_id: service._id })
      .sort({ updatedAt: -1 })
      .limit(1)
      .select('sale_off')
    const sale_off = saleOffValue ? saleOffValue.sale_off : 0

    worksheet.addRow({
      stt: index + 1,
      name: service.name,
      description: service.description,
      price: service.price.toLocaleString() + ' đ',
      discount: sale_off + ' %',
      salePrice: (service.price - (service.price * sale_off / 100)).toLocaleString() + ' đ',
      category: service.category_id?.name || '',
      status: statusText
    })
  }
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

export const serviceService = {
  createService,
  updateService,
  hideService,
  getServiceBySlug,
  getAllServices,
  getServiceById,
  deleteService,
  getFeaturedServices,
  getServiceViews,
  countViewRedis,
  exportServicesToExcel
}
