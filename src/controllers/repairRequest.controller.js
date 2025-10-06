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
    const { page = 1, limit = 10 } = req.query
    const requests = await repairService.getAllRequests(Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      requests
    })
  } catch (error) {
    next(error)
  }
}

const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params
    const request = await repairService.getRequestById(id)
    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Yêu cầu không tồn tại'
      })
    }
    res.status(StatusCodes.OK).json({
      status: 'success',
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
      message: 'Xóa yêu cầu thành công'
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