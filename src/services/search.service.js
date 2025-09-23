import ProductModel from '~/models/Product.model'
import CategoryModel from '~/models/Category.model'
import ServiceModel from '~/models/Service.model'
import ServiceCategoryModel from '~/models/ServiceCategory.model'
import Repair from '~/models/RepairRequest.model.js'
import Order from '~/models/OrderRequest.model.js'
// import UserModel from '~/models/User.model'

import { redisClient } from '~/config/redis.js'

async function searchInRedis(type, query) {
  const cacheKey = `search:${type}:${query}`;
  const cachedResults = await redisClient.get(cacheKey);
  if (cachedResults) {
    return JSON.parse(cachedResults);
  }
  return null;
}

async function cacheInRedis(type, query, results) {
  const cacheKey = `search:${type}:${query}`;
  await redisClient.set(cacheKey, JSON.stringify(results));
  await redisClient.expire(cacheKey, 3 * 3600); // 3 hours
}

const searchProducts = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const cachedResults = await searchInRedis('products', query);
  if (cachedResults) {
    return cachedResults;
  }

  const regex = new RegExp(`.*${query}.*`, 'i')
  const products = await ProductModel.find({
    $or: [
      { name: regex },
      { tags: regex },
      { brand: regex }
    ]
  }).skip(skip).limit(limit)

  await cacheInRedis('products', query, products);

  return products
}

const searchCategories = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const cachedResults = await searchInRedis('categories', query);

  if (cachedResults) {
    return cachedResults;
  }

  const regex = new RegExp(`.*${query}.*`, 'i')
  const categories = await CategoryModel.find({
    $or: [
      { name: regex },
      { description: regex }
    ]
  }).skip(skip).limit(limit)
  await cacheInRedis('categories', query, categories);
  return categories
}

const searchServices = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const cachedResults = await searchInRedis('services', query);

  if (cachedResults) {
    return cachedResults;
  }

  const regex = new RegExp(`.*${query}.*`, 'i')
  const services = await ServiceModel.find({
    $or: [
      { name: regex },
      { description: regex }
    ]
  }).skip(skip).limit(limit)
  await cacheInRedis('services', query, services);
  return services
}

const searchServiceCategories = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const cachedResults = await searchInRedis('service_categories', query);
  if (cachedResults) {
    return cachedResults;
  }

  const regex = new RegExp(`.*${query}.*`, 'i')
  const categories = await ServiceCategoryModel.find({
    $or: [
      { name: regex },
      { description: regex }
    ]
  }).skip(skip).limit(limit)
  await cacheInRedis('service_categories', query, categories);
  return categories
}

// const searchUsers = async (query, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit
//   const cachedResults = await searchInRedis('users', query);
//   if (cachedResults) {
//     return cachedResults;
//   }

//   const regex = new RegExp(`.*${query}.*`, 'i')
//   const users = await UserModel.find({
//     $or: [
//       { name: regex },
//       { email: regex },
//       { phone: regex }
//     ]
//   }).skip(skip).limit(limit)
//   await cacheInRedis('users', query, users);
//   return users
// }

const searchRequests = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const regex = new RegExp(`.*${query}.*`, 'i')
  const repair = await Repair.find({
    $or: [
      { name: regex },
      { email: regex },
      { phone: regex },
      { address: regex }
    ]
  }).skip(skip).limit(limit)

  const order = await Order.find({
    $or: [
      { name: regex },
      { email: regex },
      { phone: regex },
      { address: regex }
    ]
  }).skip(skip).limit(limit)

  return { repair, order }
}

export const searchService = {
  searchProducts,
  searchCategories,
  searchServices,
  searchServiceCategories,
  searchRequests
}
