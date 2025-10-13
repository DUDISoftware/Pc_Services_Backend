/* eslint-disable no-console */
import ProductModel from '~/models/Product.model'
import CategoryModel from '~/models/Category.model'
import ServiceModel from '~/models/Service.model'
import ServiceCategoryModel from '~/models/ServiceCategory.model'
import Repair from '~/models/RepairRequest.model.js'
import Order from '~/models/OrderRequest.model.js'
import { redisClient } from '~/config/redis.js'

const CACHE_EXPIRE_SECONDS = 3 * 3600 // 3 hours

async function getCachedResults(type, query, page, limit, fields = null) {
  const fieldsKey = fields ? JSON.stringify(fields) : ''
  const cacheKey = `search:${type}:${query}:${page}:${limit}:${fieldsKey}`
  try {
    const cached = await redisClient.get(cacheKey)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

async function setCachedResults(type, query, page, limit, results, fields = null) {
  const fieldsKey = fields ? JSON.stringify(fields) : ''
  const cacheKey = `search:${type}:${query}:${page}:${limit}:${fieldsKey}`
  try {
    await redisClient.set(cacheKey, JSON.stringify(results))
    await redisClient.expire(cacheKey, CACHE_EXPIRE_SECONDS)
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

function buildRegex(query) {
  return new RegExp(query, 'i')
}

async function searchProducts(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('products', query, page, limit, fields)
  if (cached) {
    const products = cached.products || []
    // Nếu filter rỗng → không cần lọc
    const results = Object.keys(filter).length === 0
      ? products
      : products.filter(prod => {
        return Object.entries(filter).every(([key, value]) => {
          return prod[key] != null && prod[key] == value
        })
      })

    return { ...cached, products: results }
  }
  const regex = buildRegex(query)
  try {
    // Find matching categories and collect their IDs
    const category = await CategoryModel.find({
      $or: [
        { name: regex },
        { tags: regex },
        { description: regex }
      ],
      ...filter
    }, { _id: 1 })
    const category_ids = category.map(cat => cat._id)

    // Find products directly by name, tags, brand, description, or category
    const queryObj = {
      $or: [
        { name: regex },
        { tags: regex },
        { category_id: { $in: category_ids } },
        { brand: regex },
        { description: regex }
      ],
      ...filter
    }

    const total = await ProductModel.countDocuments(queryObj)
    const products = await ProductModel.find(queryObj, fields).skip(skip).limit(limit)

    const result = {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

    await setCachedResults('products', query, page, limit, result, fields)
    return result
  } catch (error) {
    console.error('searchProducts error:', error)
    return { products: [], total: 0, page, limit, totalPages: 0 }
  }
}

async function searchCategories(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('categories', query, page, limit, fields)
  if (cached) return cached

  const regex = buildRegex(query)
  try {
    const categories = await CategoryModel.find({
      $or: [
        { name: regex },
        { description: regex }
      ],
      ...filter
    }, fields).skip(skip).limit(limit)
    await setCachedResults('categories', query, page, limit, categories, fields)
    return categories
  } catch (error) {
    console.error('searchCategories error:', error)
    return []
  }
}

async function searchServices(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('services', query, page, limit, fields)
  if (cached) return cached

  const regex = buildRegex(query)
  try {
    const services = await ServiceModel.find({
      $or: [
        { name: regex },
        { description: regex },
        { slug: regex }
      ],
      ...filter
    }, fields).skip(skip).limit(limit)
    await setCachedResults('services', query, page, limit, services, fields)
    return services
  } catch (error) {
    console.error('searchServices error:', error)
    return []
  }
}

async function searchServiceCategories(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('service_categories', query, page, limit, fields)
  if (cached) return cached

  const regex = buildRegex(query)
  try {
    const categories = await ServiceCategoryModel.find({
      $or: [
        { name: regex },
        { description: regex }
      ],
      ...filter
    }, fields).skip(skip).limit(limit)
    await setCachedResults('service_categories', query, page, limit, categories, fields)
    return categories
  } catch (error) {
    console.error('searchServiceCategories error:', error)
    return []
  }
}

async function searchRequests(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const regex = buildRegex(query)
  try {
    const repair = await Repair.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
        { address: regex },
        { problem_description: regex }
      ],
      ...filter
    }, fields).skip(skip).limit(limit)

    const order = await Order.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
        { address: regex },
        { note: regex }
      ],
      ...filter
    }, fields).skip(skip).limit(limit)

    return { repair, order }
  } catch (error) {
    console.error('searchRequests error:', error)
    return { repair: [], order: [] }
  }
}

export const searchService = {
  searchProducts,
  searchCategories,
  searchServices,
  searchServiceCategories,
  searchRequests
}
