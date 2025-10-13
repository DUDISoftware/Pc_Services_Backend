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
    const { page = 1, limit = 10, filter, fields } = req.query
    let filterObj = {}
    let fieldsArr
    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        filterObj = {}
      }
    }
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }
    const requests = await orderService.getAllRequests(Number(page), Number(limit), filterObj, fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      page: Number(page),
      limit: Number(limit),
      filter: filterObj,
      fields: fieldsArr,
      requests
    })
  } catch (error) {
    next(error)
  }
}

const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }
    const request = await orderService.getRequestById(id, fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      id,
      fields: fieldsArr,
      request
    })
  } catch (error) {
    next(error)
  }
}

const searchRequests = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10, fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }
    const results = await searchService(query, Number(page), Number(limit), fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      query,
      page: Number(page),
      limit: Number(limit),
      fields: fieldsArr,
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
    const { page = 1, limit = 10, fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }
    const requests = await orderService.getRequestsByStatus(status, Number(page), Number(limit), fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      statusParam: status,
      page: Number(page),
      limit: Number(limit),
      fields: fieldsArr,
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