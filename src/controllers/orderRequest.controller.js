import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/order.service.js'
import { searchRequests as searchService } from '~/services/search.service.js'

const createRequest = async (req, res, next) => {
  try {
    const request = await orderService.createRequest(req.body)
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
    const updatedRequest = await orderService.updateRequest(id, req.body)
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
    const hiddenRequest = await orderService.hideRequest(id)
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
    const requests = await orderService.getAllRequests(Number(page), Number(limit))
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
    const request = await orderService.getRequestById(id)
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
  }
  catch (error) {
    next(error)
  }
}

const getRequestsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params
    const { page = 1, limit = 10 } = req.query
    const requests = await orderService.getRequestsByStatus(status, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      requests
    })
  } catch (error) {
    next(error)
  }
}


export const orderController = {
  createRequest,
  updateRequest,
  hideRequest,
  getAllRequests,
  getRequestById,
  searchRequests,
  getRequestsByStatus
}