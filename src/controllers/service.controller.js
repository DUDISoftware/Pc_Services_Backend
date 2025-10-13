import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'
import { searchService } from '~/services/search.service.js'

// Create
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

// Update
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

// Hide
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

// Get All (with fields and filter as JSON)
const getAllServices = async (req, res, next) => {
  try {
    const { fields, filter } = req.query
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const services = await serviceService.getAllServices(filterObj, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', services, fields: selectFields, filter: filterObj })
  } catch (error) {
    next(error)
  }
}

// Get By Id (with fields)
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const service = await serviceService.getServiceById(id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', service, fields: selectFields })
  } catch (error) {
    next(error)
  }
}

// Get By Slug (with fields)
const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const service = await serviceService.getServiceBySlug(slug, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', service, fields: selectFields })
  } catch (error) {
    next(error)
  }
}

// Delete
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

// Search (with fields, filter as JSON)
const searchServices = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10, fields, filter } = req.query
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const results = await searchService.searchServices(query, page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      results,
      fields: selectFields,
      filter: filterObj
    })
  } catch (error) {
    next(error)
  }
}

// Count View
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

// Get Views (with fields)
const getServiceViews = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const views = await serviceService.getServiceViews(id, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      views,
      fields: selectFields
    })
  } catch (error) {
    next(error)
  }
}

// Get Featured (with fields, filter as JSON)
const getFeaturedServices = async (req, res, next) => {
  try {
    const { limit, fields, filter } = req.query
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const featured = await serviceService.getFeaturedServices(limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      services: featured,
      fields: selectFields,
      filter: filterObj
    })
  } catch (error) {
    next(error)
  }
}

const exportServicesToExcel = async (req, res, next) => {
  try {
    const buffer = await serviceService.exportServicesToExcel()
    res.setHeader('Content-Disposition', 'attachment; filename=services.xlsx')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.status(StatusCodes.OK).send(buffer)
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
  getFeaturedServices,
  exportServicesToExcel
}
