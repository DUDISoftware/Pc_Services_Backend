import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
import { redisClient } from '~/config/redis.js'

const createService = async (reqBody) => {
  const { category, ...rest } = reqBody
  const service = new ServiceModel({
    ...rest,
    category
  })
  await service.save()
  return service.populate('category_id', 'name')
}

const updateService = async (id, reqBody) => {
  const { category_id, ...rest } = reqBody
  const updateData = {
    ...rest,
    ...(category_id && { category_id }),
    updated_at: Date.now()
  }
  const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
    new: true
  }).populate('category_id', 'name')
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const hideService = async (id) => {
  const service = await ServiceModel.findById(id)
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  service.status = 'hidden'
  await service.save()
  return service
}

// src/services/customerService.service.js
const getAllServices = async (filter = {}) => {
  return await ServiceModel.find(filter)
    .populate('category_id', 'name description status') // ✅ lấy thêm thông tin category
    .sort({ created_at: -1 })
}

const getServiceById = async (id) => {
  const service = await ServiceModel.findById(id).populate(
    'category_id',
    'name description status'
  )
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const getServiceBySlug = async (slug) => {
  const service = await ServiceModel.findOne({ slug }).populate(
    'category_id',
    'name description status'
  )
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const deleteService = async (id) => {
  const service = await ServiceModel.findByIdAndDelete(id)
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const getFeaturedServices = async (limit = 4) => {
  const keys = []
  let cursor = 0

  do {
    const reply = await redisClient.scan(String(cursor), {
      MATCH: 'service:*:views',
      COUNT: 10
    })
    cursor = String(reply.cursor)
    keys.push(...reply.keys)
  } while (String(cursor) !== '0')

  if (keys.length === 0) return []

  const values = await redisClient.mGet(keys)

  const featured = keys.map((key, i) => {
    const id = key.split(':')[1]
    const raw = values[i]
    return {
      id: id,
      views: raw ? parseInt(raw, 10) : 0
    }
  })
  featured.sort((a, b) => b.views - a.views)
  return featured.slice(0, limit)
}

const getServiceViews = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.get(key)
  return views ? parseInt(views, 10) : 0
}

const countViewRedis = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.incrBy(key, 1)
  await redisClient.expire(key, 60 * 60 * 24 * 7) // expire in 1 week
  return views
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
  countViewRedis
}
