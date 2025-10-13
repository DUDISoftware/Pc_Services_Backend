import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Order from '~/models/OrderRequest.model.js'

const createRequest = async (reqBody) => {
  try {
    const newRequest = new Order(reqBody)
    await newRequest.save()
    return newRequest
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateRequest = async (id, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true })
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const hideRequest = async (id) => {
  try {
    const updateData = {
      hidden: true,
      updatedAt: Date.now()
    }
    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true })
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getAllRequests = async (page = 1, limit = 10, filter={}) => {
  try {
    const skip = (page - 1) * limit
    return await Order.find(filter)
      .populate('items.product_id', 'name price quantity images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getRequestById = async (id) => {
  try {
    const request = await Order.findById(id)
      .populate('items.product_id', 'name price quantity images')
    if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    return request
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

export const orderService = {
  createRequest,
  updateRequest,
  hideRequest,
  getRequestById,
  getAllRequests
}
