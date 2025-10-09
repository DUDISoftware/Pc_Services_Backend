import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'
import { searchService } from '~/services/search.service.js'

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body, req.files)
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
    const updated = await serviceService.updateService(id, req.body, req.files)
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

    const results = await searchService.searchServices(query, page, limit)
    res.status(StatusCodes.OK).json({
      status: 'success',
      results
    })
  } catch (error) {
    next(error)
  }
}

const countViewRedis = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    const views = await serviceService.countViewRedis(id, data)
    res.status(StatusCodes.OK).json({
      status: 'success',
      views
    })
  } catch (error) {
    next(error)
  }
}

const getServiceViews = async (req, res, next) => {
  try {
    const { id } = req.params
    const views = await serviceService.getServiceViews(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      views
    })
  } catch (error) {
    next(error)
  }
}

const getFeaturedServices = async (req, res, next) => {
  try {
    const { limit } = req.query
    const featured = await serviceService.getFeaturedServices(limit)
    res.status(StatusCodes.OK).json({
      status: 'success',
      services: featured
    })
  } catch (error) {
    next(error)
  }
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
