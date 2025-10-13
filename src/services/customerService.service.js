import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
import { redisClient } from '~/config/redis.js'
import ExcelJS from 'exceljs'

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

const getAllServices = async (filter = {}) => {
  try {
    return await ServiceModel.find(filter)
      .populate('category_id', 'name description status')
      .sort({ created_at: -1 })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getServiceById = async (id) => {
  try {
    const service = await ServiceModel.findById(id)
      .populate('category_id', 'name description status')
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getServiceBySlug = async (slug) => {
  try {
    const service = await ServiceModel.findOne({ slug })
      .populate('category_id', 'name description status')
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const deleteService = async (id) => {
  try {
    const service = await ServiceModel.findByIdAndDelete(id)
    if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
    return service
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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
    return featured.slice(0, limit)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getServiceViews = async (id) => {
  try {
    const key = `service:${id}:views`
    const views = await redisClient.get(key)
    return views ? parseInt(views, 10) : 0
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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
    { header: 'STT', key: 'stt', width: 5 },
    { header: 'Tên dịch vụ', key: 'name', width: 30 },
    { header: 'Mô tả', key: 'description', width: 40 },
    { header: 'Giá', key: 'price', width: 15 },
    { header: 'Giảm giá', key: 'discount', width: 15 },
    { header: 'Giá đã giảm', key: 'salePrice', width: 15 },
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

 customersService.forEach((customersService, index) => {
    const statusText = statusMap[customersService.status] || 'Không xác định';

    worksheet.addRow({
      stt: index + 1, 
      name: customersService.name,
      description: customersService.description,
      price: customersService.price.toLocaleString() + ' đ',
      discount: customersService.discount + ' %',
      salePrice: (customersService.price - (customersService.price * customersService.discount /100)).toLocaleString() + ' đ',
      category: customersService.category_id?.name || '',
      status: statusText,
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

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
