import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'
import { searchServices as searchService } from '~/services/search.service.js'
import { redisClient } from '~/config/redis.js'

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo dịch vụ thành công',
      service
    })
  } catch (error) {
    next(error)
  }
}

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await serviceService.updateService(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật dịch vụ thành công',
      service: updated
    })
  } catch (error) {
    next(error)
  }
}

const hideService = async (req, res, next) => {
  try {
    const { id } = req.params
    await serviceService.hideService(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Ẩn dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices()
    res.status(StatusCodes.OK).json({ status: 'success', services })
  } catch (error) {
    next(error)
  }
}

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params
    const service = await serviceService.getServiceById(id)
    res.status(StatusCodes.OK).json({ status: 'success', service })
  } catch (error) {
    next(error)
  }
}

const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const service = await serviceService.getServiceBySlug(slug)
    res.status(StatusCodes.OK).json({ status: 'success', service })
  } catch (error) {
    next(error)
  }
}

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params
    await serviceService.deleteService(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

const searchServices = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10 } = req.query
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }

    const results = await searchService(query, page, limit)
    res.status(StatusCodes.OK).json({
      status: 'success',
      results
    })
  } catch (error) {
    next(error)
  }
}

const countViewRedis = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.incr(key)
  return views
}

const getServiceViews = async (id) => {
  const key = `service:${id}:views`
  const views = await redisClient.get(key)
  return views ? parseInt(views, 10) : 0
}

const getFeaturedServices = async (limit = 8) => {
  const keys = [];
  let cursor = 0;
  do {
    const reply = await redisClient.scan(String(cursor), {
      MATCH: 'service:*:views',
      COUNT: 10,
    });
    cursor = String(reply.cursor);
    keys.push(...reply.keys);
  } while (String(cursor) !== '0');
  if (keys.length === 0) return [];
  const values = await redisClient.mGet(keys);
  const featured = keys.map((key, i) => {
    const id = key.split(':')[1];
    const raw = values[i];
    return {
      id: id,
      views: raw ? parseInt(raw, 10) : 0, // convert từ string về number
    };
  });
  featured.sort((a, b) => b.views - a.views);
  return featured.slice(0, limit);
}

export const serviceController = {
  createService,
  updateService,
  hideService,
  getAllServices,
  getServiceById,
  getServiceBySlug,
  deleteService,
  searchServices,
  countViewRedis,
  getServiceViews,
  getFeaturedServices
}
