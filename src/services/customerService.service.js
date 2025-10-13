import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
import { redisClient } from '~/config/redis.js'

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
      .select('-__v') // add all fields except __v
      .populate('category_id', 'name description status')
      .sort({ created_at: -1 })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getServiceById = async (id) => {
  try {
    const service = await ServiceModel.findById(id.toString())
      .select('-__v') // add all fields except __v
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
      .select('-__v') // add all fields except __v
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
