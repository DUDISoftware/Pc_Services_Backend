import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Order from '~/models/OrderRequest.model.js'

// Added 'fields' parameter to getAllRequests
/**
 * Creates a new order request and saves it to the database.
 *
 * @param {Object} reqBody - The request body containing order details.
 * @returns {Promise<Object>} - A promise that resolves to the newly created order request.
 * @throws {ApiError} - Throws an error if the creation fails.
 */
const createRequest = async (reqBody) => {
  try {
    const newRequest = new Order(reqBody)
    await newRequest.save()
    return newRequest
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

/**
 * Updates an existing order request by its ID.
 *
 * @param {string} id - The ID of the order request to update.
 * @param {Object} reqBody - The updated order details.
 * @returns {Promise<Object>} - A promise that resolves to the updated order request.
 * @throws {ApiError} - Throws an error if the update fails or the request is not found.
 */
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

/**
 * Hides an order request by setting its 'hidden' property to true.
 *
 * @param {string} id - The ID of the order request to hide.
 * @returns {Promise<Object>} - A promise that resolves to the updated order request.
 * @throws {ApiError} - Throws an error if the request is not found or the operation fails.
 */
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

/**
 * Retrieves a paginated list of order requests from the database.
 * Supports filtering, field selection, and population of product details within order items.
 *
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of orders to retrieve per page.
 * @param {Object} [filter={}] - MongoDB filter object to query specific orders.
 * @param {string} [fields=''] - Space-separated list of fields to include in the result.
 * @returns {Promise<Array>} - A promise that resolves to an array of order requests.
 * @throws {ApiError} - Throws an error if the database operation fails.
 */
const getAllRequests = async (page = 1, limit = 10, filter = {}, fields = '') => {
  try {
    const skip = (page - 1) * limit
    return await Order.find(filter)
      .select(fields)
      .populate('items.product_id', 'name price quantity images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a single order request by its ID.
 * Supports field selection and population of product details within order items.
 *
 * @param {string} id - The ID of the order request to retrieve.
 * @param {string} [fields=''] - Space-separated list of fields to include in the result.
 * @returns {Promise<Object>} - A promise that resolves to the order request.
 * @throws {ApiError} - Throws an error if the request is not found or the operation fails.
 */
const getRequestById = async (id, fields = '') => {
  try {
    const request = await Order.findById(id)
      .select(fields)
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
