import { StatusCodes } from 'http-status-codes'
import { repairService } from '~/services/repair.service.js'
import { searchRequests as searchService } from '~/services/search.service.js'

const createRequest = async (req, res, next) => {
  try {
    const request = await repairService.createRequest(req.body, req.files)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo yêu cầu thành công',
      request
    })
  } catch (error) {
    next(error)
  }
}

const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedRequest = await repairService.updateRequest(id, req.body, req.files)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật yêu cầu thành công',
      updatedRequest
    })
  } catch (error) {
    next(error)
  }
}

const hideRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const hiddenRequest = await repairService.hideRequest(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Yêu cầu đã được ẩn',
      hiddenRequest
    })
  } catch (error) {
    next(error)
  }
}

const getAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, filter = {}, fields = '' } = req.query
    const filterObj = typeof filter === 'string' ? JSON.parse(filter) : filter
    const selectFields = fields ? fields.split(',') : undefined
    const requests = await repairService.getAllRequests(Number(page), Number(limit), filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      page: Number(page),
      limit: Number(limit),
      filter: filterObj,
      fields: fields.split(','),
      requests
    })
  } catch (error) {
    next(error)
  }
}

const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields = '' } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const request = await repairService.getRequestById(id, selectFields)
    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Yêu cầu không tồn tại',
        id
      })
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
      id,
      request
    })
  } catch (error) {
    next(error)
  }
}

const searchRequests = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query
    const results = await searchService(query, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      query,
      page: Number(page),
      limit: Number(limit),
      results
    })
  } catch (error) {
    next(error)
  }
}

const getRequestsByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params
    const { page = 1, limit = 10 } = req.query
    const requests = await repairService.getRequestsByService(serviceId, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      serviceId,
      page: Number(page),
      limit: Number(limit),
      requests
    })
  } catch (error) {
    next(error)
  }
}

const getRequestsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params
    const { page = 1, limit = 10 } = req.query
    const requests = await repairService.getRequestsByStatus(status, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      statusParam: status,
      page: Number(page),
      limit: Number(limit),
      requests
    })
  } catch (error) {
    next(error)
  }
}

const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    await repairService.deleteRequest(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa yêu cầu thành công',
      id
    })
  } catch (error) {
    next(error)
  }
}

export const repairController = {
  createRequest,
  updateRequest,
  hideRequest,
  deleteRequest,
  getAllRequests,
  getRequestById,
  searchRequests,
  getRequestsByService,
  getRequestsByStatus
}