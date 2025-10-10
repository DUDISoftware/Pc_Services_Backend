import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ProductModel from '~/models/Product.model'
import { deleteImage } from '~/utils/cloudinary.js'
import { redisClient } from '~/config/redis.js'

const createProduct = async (reqBody, files) => {
  const images = files?.map(file => ({
    url: file.path,
    public_id: file.filename
  })) || []
  const newProduct = new ProductModel({ ...reqBody, images })
  await newProduct.save()
  return newProduct
}

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

const updateQuantity = async (id, quantity) => {
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { quantity },
    { new: true }
  )
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

const updateStatus = async (id, status) => {
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return updated
}

const deleteProduct = async (id) => {
  const result = await ProductModel.findByIdAndDelete(id)
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  if (result.images?.length) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
  }
  return result
}

const getAllProducts = async (page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit
  const products = await ProductModel.find(filter)
    .populate('category_id', 'name slug')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
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

const getFeaturedProducts = async (limit = 4) => {
  const keys = []
  let cursor = '0'
  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: 'product:*:views',
      COUNT: 10
    })
    cursor = reply.cursor
    keys.push(...reply.keys)
  } while (cursor !== '0')
  if (keys.length === 0) return []
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
  return featured.slice(0, limit)
}

const getRelatedProducts = async (productId, limit = 4) => {
  const product = await ProductModel.findById(productId)
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  const related = await ProductModel.find({
    category_id: product.category_id,
    _id: { $ne: productId },
    status: 'available'
  })
    .limit(limit)
    .sort({ createdAt: -1 })
  return related
}

const getProductById = async (id) => {
  const product = await ProductModel.findById(id).populate('category_id', 'name')
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return product
}

const getProductsByCategory = async (categoryId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const products = await ProductModel.find({ category_id: categoryId })
    .populate('category_id', 'name slug')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  const total = await ProductModel.countDocuments({ category_id: categoryId })
  return {
    status: 'success',
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    products
  }
}

const getProductBySlug = async (slug) => {
  const product = await ProductModel.findOne({ slug }).populate('category_id', 'name slug')
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return product
}

const getProductViews = async (id) => {
  const key = `product:${id}:views`
  const views = await redisClient.get(key)
  return views ? parseInt(views, 10) : 0
}

const countViewRedis = async (id) => {
  const key = `product:${id}:views`
  const views = await redisClient.incrBy(key, 1)
  await redisClient.expire(key, 60 * 60 * 24 * 7)
  return views
}

const getQuantity = async (id) => {
  const product = await ProductModel.findById(id)
  if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
  return product.quantity
}

export const productService = {
  createProduct,
  updateProduct,
  updateQuantity,
  updateStatus,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  getProductBySlug,
  getQuantity,
  getProductViews,
  countViewRedis
}
