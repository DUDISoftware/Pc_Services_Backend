import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Order from '~/models/OrderRequest.model.js'

const createRequest = async (reqBody) => {
  const newRequest = new Order(reqBody)
  await newRequest.save()
  return newRequest
}

const updateRequest = async (id, reqBody) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }
  const updated = await Order.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const hideRequest = async (id) => {
  const updateData = {
    hidden: true,
    updatedAt: Date.now()
  }
  const updated = await Order.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const getAllRequests = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const requests = await Order.find()
    .populate('items.product_id', 'name price images')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  return requests
}

const getRequestById = async (id) => {
  const request = await Order.findById(id)
    .populate('items.product_id', 'name price images')
  if (!request) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return request
}

export const orderService = {
  createRequest,
  updateRequest,
  hideRequest,
  getRequestById,
  getAllRequests
}
