/* eslint-disable no-prototype-builtins */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ProductModel from '~/models/Product.model'
import { deleteImage } from '~/utils/cloudinary.js'
import { redisClient } from '~/config/redis.js'
import mongoose from 'mongoose'
import ExcelJS from 'exceljs'
import DiscountModel from '~/models/Discount.model'


// ========== HELPER FUNCTION ==========
// 🔹 Aggregation pipeline chung để join ratings + latest discount + category
const productAggregationBase = [
  // Join ratings
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'product_id',
      as: 'ratings'
    }
  },
  // Join latest product discount
  {
    $lookup: {
      from: 'discounts',
      let: { productId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
        { $sort: { updatedAt: -1 } },
        { $limit: 1 }
      ],
      as: 'product_discount'
    }
  },
  // Join category
  {
    $lookup: {
      from: 'categories',
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
        { $match: { $expr: { $eq: ['$product_category_id', '$$catId'] } } },
        { $sort: { updatedAt: -1 } },
        { $limit: 1 }
      ],
      as: 'category_discount'
    }
  },

  {
    $addFields: {
      // Rating info
      avg_rating: {
        $cond: [
          { $gt: [{ $size: '$ratings' }, 0] },
          { $avg: '$ratings.score' },
          0
        ]
      },
      rating_count: { $size: '$ratings' },

      // Sale_off comparison (override nếu category >= product)
      sale_off: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
          { $ifNull: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, 0] }
        ]
      },
      start_date: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $arrayElemAt: ['$category_discount.start_date', 0] },
          { $arrayElemAt: ['$product_discount.start_date', 0] }
        ]
      },
      end_date: {
        $cond: [
          {
            $or: [
              { $eq: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, null] },
              {
                $lt: [
                  { $ifNull: [{ $arrayElemAt: ['$product_discount.sale_off', 0] }, 0] },
                  { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                ]
              }
            ]
          },
          { $arrayElemAt: ['$category_discount.end_date', 0] },
          { $arrayElemAt: ['$product_discount.end_date', 0] }
        ]
      }
    }
  },

  // Tính final_price từ giá đã giảm
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

  // Loại bỏ trường không cần thiết
  {
    $project: {
      ratings: 0,
      product_discount: 0,
      category_discount: 0
    }
  }
]

const buildProductAggregation = (filter = {}, fields = '') => {
  const pipeline = [
    { $match: filter },
    ...productAggregationBase // ratings + discounts + category + computed fields
  ]
  // Nếu có fields (không rỗng), thì thêm $project
  if ((Array.isArray(fields) && fields.length > 0) || (typeof fields === 'string' && fields.trim() !== '')) {
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

  return pipeline
}

// ========== SERVICE FUNCTIONS ==========
/**
 * Creates a new product with provided data and image files.
 *
 * @param {Object} reqBody - Product data from request body.
 * @param {Array} files - Array of image files.
 * @returns {Promise<Object>} The newly created product document.
 */
const createProduct = async (reqBody, files) => {
  const images = files?.map(file => ({
    url: file.path,
    public_id: file.filename
  })) || []
  const newProduct = new ProductModel({ ...reqBody, images })
  await newProduct.save()
  return newProduct
}

/**
 * Updates an existing product by ID with new data and image files.
 *
 * @param {string} id - Product ID.
 * @param {Object} reqBody - Updated product data.
 * @param {Array} files - Array of new image files.
 * @returns {Promise<Object>} The updated product document.
 */
const updateProduct = async (id, reqBody, files) => {
  const updateData = { ...reqBody, updatedAt: Date.now() }
  if (files?.length) {
    updateData.images = files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }
  const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

/**
 * Updates the quantity of a product by ID.
 *
 * @param {string} id - Product ID.
 * @param {number} quantity - New quantity value.
 * @returns {Promise<Object>} The updated product document.
 */
const updateQuantity = async (id, quantity) => {
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { quantity },
    { new: true }
  )
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

/**
 * Updates the status of a product by ID.
 *
 * @param {string} id - Product ID.
 * @param {string} status - New status value.
 * @returns {Promise<Object>} The updated product document.
 */
const updateStatus = async (id, status) => {
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

/**
 * Deletes a product by ID and removes its images from cloud storage.
 *
 * @param {string} id - Product ID.
 * @returns {Promise<Object>} The deleted product document.
 */
const deleteProduct = async (id) => {
  const result = await ProductModel.findByIdAndDelete(id)
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  if (result.images?.length) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
  }
  return result
}

/**
 * Retrieves all products with pagination, filtering, and field selection.
 *
 * @param {number} [page=1] - Page number.
 * @param {number} [limit=10] - Number of products per page.
 * @param {Object} [filter={}] - MongoDB filter object.
 * @param {string} [fields=''] - Fields to select from product documents.
 * @returns {Promise<Object>} Paginated products and metadata.
 */
const getAllProducts = async (page = 1, limit = 10, filter = {}, fields = '', order = { createdAt: -1 }) => {
  const skip = (page - 1) * limit

  const products = await ProductModel.aggregate([
    ...buildProductAggregation(filter, fields),
    { $sort: order },
    { $skip: skip },
    { $limit: limit }
  ])

  const total = await ProductModel.countDocuments(filter)

  return {
    status: 'success',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products
  }
}

/**
 * Retrieves the most viewed (featured) products from Redis and MongoDB.
 * Scans Redis for product view counts, sorts products by views, and fetches product details from the database.
 *
 * @param {number} [limit=4] - The maximum number of featured products to return.
 * @param {string} [fields=''] - Fields to select from the product documents.
 * @returns {Promise<Array<Object>>} Array of featured product objects with view counts.
 */
const getFeaturedProducts = async (limit = 4, fields = '') => {
  const keys = []
  let cursor = '0'

  // Step 1: Scan Redis for product views
  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: 'product:*:views',
      COUNT: 10
    })
    cursor = reply.cursor
    keys.push(...reply.keys)
  } while (cursor !== '0')

  if (!keys.length) return []

  const values = await redisClient.mGet(keys)
  const featured = keys.map((key, i) => {
    const id = key.split(':')[1]
    const raw = values[i]
    return {
      id,
      views: raw ? parseInt(raw, 10) : 0
    }
  })

  featured.sort((a, b) => b.views - a.views)
  const topIds = featured.slice(0, limit).map(f => f.id)

  // Step 2: Build filter
  const filter = {
    _id: { $in: topIds.map(id => new mongoose.Types.ObjectId(id)) }
  }

  // Step 3: Query with aggregation pipeline
  const products = await ProductModel.aggregate(buildProductAggregation(filter, fields))

  // Step 4: Map views back to products
  return products.map(product => ({
    ...product,
    views: featured.find(f => f.id === String(product._id))?.views || 0
  }))
}

/**
 * Retrieves related products by category, excluding the current product.
 *
 * @param {string} productId - Product ID to find related products for.
 * @param {number} [limit=4] - Maximum number of related products.
 * @param {string} [fields=''] - Fields to select from product documents.
 * @returns {Promise<Array<Object>>} Array of related product documents.
 */
const getRelatedProducts = async (productId, limit = 4, fields = '') => {
  const product = await ProductModel.findById(productId)
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')

  const related = {
    category_id: product.category_id,
    _id: { $ne: productId },
    status: 'available'
  }

  const pipeline = [
    ...buildProductAggregation(related, fields),
    { $sort: { createdAt: -1 } },
    { $limit: limit }
  ]

  return await ProductModel.aggregate(pipeline)
}

/**
 * Retrieves a product by its ID.
 *
 * @param {string} id - Product ID.
 * @param {string} [fields=''] - Fields to select from product document.
 * @returns {Promise<Object>} The product document.
 */
const getProductById = async (id, fields = '') => {
  // const product = await ProductModel.findById(id)
  //   .select(fields)
  //   .populate('category_id', 'name slug')

  const productAgg = await ProductModel.aggregate(
    buildProductAggregation({ _id: new mongoose.Types.ObjectId(id) }, fields)
  )
  const finalProduct = productAgg[0]
  if (!finalProduct) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return finalProduct
}

/**
 * Retrieves products by category with pagination and field selection.
 *
 * @param {string} categoryId - Category ID.
 * @param {number} [page=1] - Page number.
 * @param {number} [limit=10] - Number of products per page.
 * @param {string} [fields=''] - Fields to select from product documents.
 * @returns {Promise<Object>} Paginated products and metadata.
 */
const getProductsByCategory = async (categoryId, page = 1, limit = 10, fields = '', order = { createdAt: -1 }) => {
  const skip = (page - 1) * limit

  const filter = { category_id: new mongoose.Types.ObjectId(categoryId) }

  const pipeline = [
    ...buildProductAggregation(filter, fields),
    { $sort: order },
    { $skip: skip },
    { $limit: limit }
  ]

  const products = await ProductModel.aggregate(pipeline)

  const total = await ProductModel.countDocuments({ category_id: categoryId })
  return {
    status: 'success',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products: products
  }
}

/**
 * Retrieves a product by its slug.
 *
 * @param {string} slug - Product slug.
 * @param {string} [fields=''] - Fields to select from product document.
 * @returns {Promise<Object>} The product document.
 */
const getProductBySlug = async (slug, fields = '') => {
  const pipeline = buildProductAggregation({ slug }, fields)
  const result = await ProductModel.aggregate(pipeline)

  if (!result.length) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return result[0]
}

/**
 * Retrieves the view count for a product from Redis.
 *
 * @param {string} id - Product ID.
 * @returns {Promise<number>} Number of views.
 */
const getProductViews = async (id) => {
  const key = `product:${id}:views`
  const views = await redisClient.get(key)
  return views ? parseInt(views, 10) : 0
}

/**
 * Increments the view count for a product in Redis and sets expiration.
 *
 * @param {string} id - Product ID.
 * @returns {Promise<number>} Updated number of views.
 */
const countViewRedis = async (id) => {
  const key = `product:${id}:views`
  const views = await redisClient.incrBy(key, 1)
  await redisClient.expire(key, 60 * 60 * 24 * 7)
  return views
}

/**
 * Retrieves the quantity of a product by ID.
 *
 * @param {string} id - Product ID.
 * @returns {Promise<number>} Product quantity.
 */
const getQuantity = async (id) => {
  const product = await ProductModel.findById(id)
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return product.quantity
}


const exportProductsToExcel = async () => {
  const products = await ProductModel.find()
    .populate('category_id', 'name slug')
    .sort({ createdAt: -1 })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Products')

  worksheet.columns = [
    { header: 'STT', key: 'stt', width: 5 },
    { header: 'Tên sản phẩm', key: 'name', width: 30 },
    { header: 'Mô tả', key: 'description', width: 40 },
    { header: 'Giá gốc', key: 'price', width: 15 },
    { header: 'Giảm giá', key: 'discount', width: 15 },
    { header: 'Giá đã giảm', key: 'salePrice', width: 15 },
    { header: 'Danh mục', key: 'brand', width: 15 },
    { header: 'Số lượng', key: 'quantity', width: 15 },
    { header: 'Trạng thái', key: 'statuss', width: 15 }
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
    available: 'Có sẵn',
    out_of_stock: 'Hết hàng',
    hidden: 'Đã ẩn'
  }

  // Fetch sale_off for all products in parallel
  const saleOffs = await Promise.all(
    products.map(product =>
      DiscountModel.findOne({ product_id: product._id })
        .sort({ updatedAt: -1 })
        .limit(1)
        .select('sale_off')
    )
  )

  products.forEach((product, index) => {
    const statusText = statusMap[product.status] || 'Không xác định'
    const saleOffValue = saleOffs[index] ? saleOffs[index].sale_off : 0
    worksheet.addRow({
      stt: index + 1,
      name: product.name,
      description: product.description,
      price: product.price.toLocaleString() + ' đ',
      discount: saleOffValue + ' %',
      salePrice: (product.price - (product.price * saleOffValue / 100)).toLocaleString() + ' đ',
      brand: product.brand,
      quantity: product.quantity,
      statuss: statusText
    })
  })
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

export const productService = {
  createProduct,
  updateProduct,
  deleteProduct,
  // === get products ===
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  getProductBySlug,
  // === others ===
  updateQuantity,
  updateStatus,
  getQuantity,
  getProductViews,
  countViewRedis,
  exportProductsToExcel
}
