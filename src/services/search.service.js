/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import ProductModel from '~/models/Product.model'
import CategoryModel from '~/models/Category.model'
import ServiceModel from '~/models/Service.model'
import ServiceCategoryModel from '~/models/ServiceCategory.model'
import Repair from '~/models/RepairRequest.model.js'
import Order from '~/models/OrderRequest.model.js'
import { redisClient } from '~/config/redis.js'
import mongoose from 'mongoose'
import { start } from 'agenda/dist/agenda/start'

const CACHE_EXPIRE_SECONDS = 3 * 3600 // 3 hours

// ========================= Aggregation pipeline builders =========================
/**
 * Builds an aggregation pipeline for products with avg_rating and latest discount info.
 *
 * @param {Object} [match={}] - Filter conditions for $match stage.
 * @param {Object|null} [fields=null] - Projection fields to include or exclude.
 * @param {number} [skip=0] - Number of documents to skip.
 * @param {number} [limit=10] - Number of documents to return.
 * @returns {Array} Aggregation pipeline array
 */
/**
 * Build full product aggregation pipeline with ratings, discount, category, pagination.
 */
// ======================= Helper: buildProductAggregation =======================
export function buildProductAggregation({ match = {}, fields = null, skip = 0, limit = 10 }) {
  const pipeline = [
    { $match: match },

    // Join ratings
    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'product_id',
        as: 'ratings'
      }
    },
    {
      $addFields: {
        avg_rating: {
          $cond: [{ $gt: [{ $size: '$ratings' }, 0] }, { $avg: '$ratings.score' }, 0]
        },
        rating_count: { $size: '$ratings' }
      }
    },

    // Join latest product discount
    {
      $lookup: {
        from: 'discounts',
        let: { pid: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$product_id', '$$pid'] }, { $ne: ['$sale_off', null] }] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'discountInfo'
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
          { $match: { $expr: { $and: [{ $eq: ['$product_category_id', '$$catId'] }, { $ne: ['$sale_off', null] }] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'category_discount'
      }
    },

    // Override sale_off, start_date, end_date, final_price
    {
      $addFields: {
        sale_off: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
            { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] }
          ]
        },
        start_date: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $arrayElemAt: ['$category_discount.start_date', 0] },
            { $arrayElemAt: ['$discountInfo.start_date', 0] }
          ]
        },
        end_date: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $arrayElemAt: ['$category_discount.end_date', 0] },
            { $arrayElemAt: ['$discountInfo.end_date', 0] }
          ]
        },
        final_price: {
          $round: [
            {
              $multiply: [
                '$price',
                {
                  $divide: [
                    {
                      $subtract: [100,
                        {
                          $cond: [
                            {
                              $or: [
                                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                                {
                                  $lt: [
                                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                                  ]
                                }
                              ]
                            },
                            { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
                            { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] }
                          ]
                        }
                      ]
                    },
                    100
                  ]
                }
              ]
            },
            0
          ]
        }
      }
    }
  ]

  const baseProjection = { discountInfo: 0, category_discount: 0, ratings: 0 }
  if (Array.isArray(fields) && fields.length > 0) {
    const fieldObj = Object.fromEntries(fields.map(f => [f, 1]))
    pipeline.push({ $project: { ...fieldObj, ...baseProjection, avg_rating: 1, rating_count: 1, sale_off: 1, final_price: 1, category: 1 } })
  } else {
    pipeline.push({ $project: { ...baseProjection } })
  }

  if (typeof skip === 'number' && skip >= 0) pipeline.push({ $skip: skip })
  if (typeof limit === 'number' && limit > 0) pipeline.push({ $limit: limit })

  return pipeline
}

// ======================= Helper: buildServiceAggregation =======================
export function buildServiceAggregation({ match = {}, fields = null, skip = 0, limit = 10 }) {
  const pipeline = [
    { $match: match },

    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'service_id',
        as: 'ratings'
      }
    },
    {
      $addFields: {
        avg_rating: {
          $cond: [{ $gt: [{ $size: '$ratings' }, 0] }, { $avg: '$ratings.score' }, 0]
        },
        rating_count: { $size: '$ratings' }
      }
    },

    {
      $lookup: {
        from: 'discounts',
        let: { sid: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$service_id', '$$sid'] },
                  { $ne: ['$sale_off', null] }
                ]
              }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'discountInfo'
      }
    },

    {
      $lookup: {
        from: 'service_categories',
        localField: 'category_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'discounts',
        let: { catId: '$category._id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$service_category_id', '$$catId'] },
                  { $ne: ['$sale_off', null] }
                ]
              }
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'category_discount'
      }
    },

    {
      $addFields: {
        sale_off: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
            { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] }
          ]
        },
        start_date: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $arrayElemAt: ['$category_discount.start_date', 0] },
            { $arrayElemAt: ['$discountInfo.start_date', 0] }
          ]
        },
        end_date: {
          $cond: [
            {
              $or: [
                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                {
                  $lt: [
                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                  ]
                }
              ]
            },
            { $arrayElemAt: ['$category_discount.end_date', 0] },
            { $arrayElemAt: ['$discountInfo.end_date', 0] }
          ]
        },
        final_price: {
          $round: [
            {
              $multiply: [
                '$price',
                {
                  $divide: [
                    {
                      $subtract: [
                        100,
                        {
                          $cond: [
                            {
                              $or: [
                                { $eq: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, null] },
                                {
                                  $lt: [
                                    { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] },
                                    { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] }
                                  ]
                                }
                              ]
                            },
                            { $ifNull: [{ $arrayElemAt: ['$category_discount.sale_off', 0] }, 0] },
                            { $ifNull: [{ $arrayElemAt: ['$discountInfo.sale_off', 0] }, 0] }
                          ]
                        }
                      ]
                    },
                    100
                  ]
                }
              ]
            },
            0
          ]
        }
      }
    }
  ]

  const baseExclusions = { discountInfo: 0, category_discount: 0, ratings: 0 }

  if (Array.isArray(fields) && fields.length > 0) {
    const fieldObj = Object.fromEntries(fields.map(f => [f, 1]))

    // Bỏ hết `0` để tránh conflict
    pipeline.push({
      $project: {
        ...fieldObj,
        avg_rating: 1,
        rating_count: 1,
        sale_off: 1,
        final_price: 1,
        category: { _id: 1, name: 1, slug: 1 }, // Trả đúng thông tin category
        _id: 1 // Đảm bảo _id luôn được bao gồm rõ ràng
      }
    })
  } else {
    // Chỉ dùng exclusion nếu không có fields cụ thể
    pipeline.push({
      $project: {
        ...baseExclusions
      }
    })
  }
  if (typeof skip === 'number' && skip >= 0) pipeline.push({ $skip: skip })
  if (typeof limit === 'number' && limit > 0) pipeline.push({ $limit: limit })
  return pipeline

}

// ========================= Search functions ========================= //

/**
 * Retrieves cached search results from Redis using a generated key based on search parameters.
 *
 * @param {string} type - The type of search being performed.
 * @param {string} query - The search query string.
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of results per page.
 * @param {Object|null} [fields=null] - Optional fields used in the search, included in the cache key if provided.
 * @returns {Promise<Array|Object|null>} The cached search results, or null if not found.
 */
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

/**
 * Caches search results in Redis with a generated key based on search parameters.
 *
 * @param {string} type - The type of search being performed.
 * @param {string} query - The search query string.
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of results per page.
 * @param {Array|Object} results - The search results to cache.
 * @param {Object|null} [fields=null] - Optional fields used in the search, included in the cache key if provided.
 * @returns {Promise<void>} Resolves when caching is complete.
 */
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

/**
 * Searches for products based on a query string, pagination, filters, and selected fields.
 * Utilizes cached results if available for performance optimization.
 * Supports searching by product name, tags, brand, description, and related categories.
 *
 * @async
 * @function searchProducts
 * @param {string} query - The search keyword or phrase.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of products per page.
 * @param {Object} [filter={}] - Additional filter criteria as key-value pairs.
 * @param {Object|null} [fields=''] - Fields to include or exclude in the returned products.
 * @param {Object} [order={ createdAt: -1 }] - Sorting order for the results.
 * @returns {Promise<Object>} An object containing the matched products, total count, pagination info, and total pages.
 */
async function searchProducts(query, page = 1, limit = 10, filter = {}, fields = '', order = { createdAt: -1 }) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('products', query, page, limit, fields)
  if (cached && cached.products.length !== 0 && 0 === 1) {
    const products = cached.products
    const results = Object.keys(filter).length === 0
      ? products
      : products.filter(prod =>
        Object.entries(filter).every(([key, val]) => prod[key] == val)
      )
    const orderedResults = results.sort((a, b) => {
      for (const [key, direction] of Object.entries(order)) {
        if (a[key] < b[key]) return direction === 1 ? -1 : 1
        if (a[key] > b[key]) return direction === 1 ? 1 : -1
      }
      return 0
    })

    return { ...cached, products: orderedResults }
  }

  const regex = buildRegex(query)
  const matchedCategories = await CategoryModel.find({
    $or: [
      { name: regex },
      { tags: regex },
      { description: regex }
    ]
  }, { _id: 1 })

  const category_ids = matchedCategories.map(c => c._id)

  const match = {
    $or: [
      { name: regex },
      { tags: regex },
      { brand: regex },
      { description: regex },
      { category_id: { $in: category_ids } }
    ],
    ...filter
  }

  try {
    const pipeline = buildProductAggregation({ match, fields, skip, limit })
    const pipelineWithSort = [...pipeline.slice(0, -2), { $sort: order }, ...pipeline.slice(-2)]

    const countPipeline = [
      { $match: match },
      { $count: 'total' }
    ]

    const [products, countResult] = await Promise.all([
      ProductModel.aggregate(pipelineWithSort),
      ProductModel.aggregate(countPipeline)
    ])

    const total = countResult[0]?.total || 0

    const result = {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

    await setCachedResults('products', query, page, limit, result, fields)
    return result
  } catch (err) {
    console.error('searchProducts error:', err)
    return { products: [], total: 0, page, limit, totalPages: 0 }
  }
}

/**
 * Searches for categories based on a query string, pagination, filters, and selected fields.
 * Utilizes cached results if available for performance optimization.
 *
 * @async
 * @function searchCategories
 * @param {string} query - The search keyword or phrase.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of categories per page.
 * @param {Object} [filter={}] - Additional filter criteria as key-value pairs.
 * @param {Object|null} [fields=null] - Fields to include or exclude in the returned categories.
 * @returns {Promise<Array>} An array of matched categories.
 */
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

/**
 * Searches for services based on a query string, pagination, filters, and selected fields.
 * Utilizes cached results if available for performance optimization.
 *
 * @async
 * @function searchServices
 * @param {string} query - The search keyword or phrase.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of services per page.
 * @param {Object} [filter={}] - Additional filter criteria as key-value pairs.
 * @param {Object|null} [fields=null] - Fields to include or exclude in the returned services.
 * @returns {Promise<Array>} An array of matched services.
 */
async function searchServices(query, page = 1, limit = 10, filter = {}, fields = null) {
  const skip = (page - 1) * limit
  const cached = await getCachedResults('services', query, page, limit, fields)
  if (cached) return cached

  const regex = buildRegex(query)

  const match = {
    $or: [
      { name: regex },
      { description: regex },
      { slug: regex }
    ],
    ...filter
  }

  try {
    const pipeline = buildServiceAggregation({ match, fields, skip, limit })
    const countPipeline = [{ $match: match }, { $count: 'total' }]

    const [services, countRes] = await Promise.all([
      ServiceModel.aggregate(pipeline),
      ServiceModel.aggregate(countPipeline)
    ])

    const total = countRes[0]?.total || 0
    const result = {
      services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
    await setCachedResults('services', query, page, limit, result, fields)
    return result
  } catch (error) {
    console.error('searchServices error:', error)
    return { services: [], total: 0, page, limit, totalPages: 0 }
  }
}

/**
 * Searches for service categories based on a query string, pagination, filters, and selected fields.
 * Utilizes cached results if available for performance optimization.
 *
 * @async
 * @function searchServiceCategories
 * @param {string} query - The search keyword or phrase.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of service categories per page.
 * @param {Object} [filter={}] - Additional filter criteria as key-value pairs.
 * @param {Object|null} [fields=null] - Fields to include or exclude in the returned service categories.
 * @returns {Promise<Array>} An array of matched service categories.
 */

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


/**
 * Searches for repair and order requests based on a query string, pagination, filters, and selected fields.
 * Returns both repair and order requests matching the criteria.
 *
 * @async
 * @function searchRequests
 * @param {string} query - The search keyword or phrase.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of requests per page.
 * @param {Object} [filter={}] - Additional filter criteria as key-value pairs.
 * @param {Object|null} [fields=null] - Fields to include or exclude in the returned requests.
 * @returns {Promise<Object>} An object containing arrays of matched repair and order requests.
 */
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
