import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Repair from '~/models/RepairRequest.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

/**
 * Creates a new repair request with the provided request body and optional image files.
 * Images are saved with their path and filename.
 *
 * @param {Object} reqBody - The request body containing repair request details.
 * @param {Array<Object>} [files] - Optional array of image file objects, each containing 'path' and 'filename'.
 * @returns {Promise<Object>} The newly created repair request object.
 * @throws {ApiError} If an internal server error occurs.
 */
const createRequest = async (reqBody, files) => {
  try {
    const images = files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || []

    const newRequest = new Repair({
      ...reqBody,
      images
    })

    await newRequest.save()
    return newRequest
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates a repair request by its ID with the provided request body and optional image files.
 * If image files are provided, their paths and filenames are added to the request's images.
 * Updates the 'updatedAt' timestamp to the current time.
 *
 * @param {string} id - The ID of the repair request to update.
 * @param {Object} reqBody - The request body containing fields to update.
 * @param {Array<Object>} [files] - Optional array of image file objects, each containing 'path' and 'filename'.
 * @returns {Promise<Object>} The updated repair request object.
 * @throws {ApiError} If the request is not found or an internal server error occurs.
 */
const updateRequest = async (id, reqBody, files) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    if (files?.length) {
      updateData.images = files.map(file => ({
        url: file.path,
        public_id: file.filename
      }))
    }

    const updated = await Repair.findByIdAndUpdate(id, updateData, { new: true })
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Hides a repair request by setting its 'hidden' property to true and updating the 'updatedAt' timestamp.
 *
 * @param {string} id - The ID of the repair request to hide.
 * @returns {Promise<Object>} The updated repair request object.
 * @throws {ApiError} If the request is not found or an internal server error occurs.
 */
const hideRequest = async (id) => {
  try {
    const updated = await Repair.findByIdAndUpdate(
      id,
      { hidden: true, updatedAt: Date.now() },
      { new: true }
    )
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves all repair requests with pagination, filtering, and field selection.
 * Populates the 'service_id' field with service name and price.
 *
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of requests per page.
 * @param {Object} [filter={}] - Optional filter criteria.
 * @param {string} [fields=''] - Optional fields to select.
 * @returns {Promise<Array<Object>>} Array of repair request objects.
 * @throws {ApiError} If an internal server error occurs.
 */
const getAllRequests = async (page = 1, limit = 10, filter = {}, fields = '') => {
  try {
    const skip = (page - 1) * limit
    return await Repair.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select(fields)
      .populate('service_id', 'name price')
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a repair request by its ID with optional field selection.
 *
 * @param {string} id - The ID of the repair request to retrieve.
 * @param {string} [fields=''] - Optional fields to select.
 * @returns {Promise<Object>} The repair request object.
 * @throws {ApiError} If an internal server error occurs.
 */
const getRequestById = async (id, fields = '') => {
  try {
    return await Repair.findById(id).select(fields)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a repair request by its ID and removes associated images from cloud storage.
 *
 * @param {string} id - The ID of the repair request to delete.
 * @returns {Promise<Object>} The deleted repair request object.
 * @throws {ApiError} If the request is not found or an internal server error occurs.
 */
const deleteRequest = async (id) => {
  try {
    const result = await Repair.findByIdAndDelete(id)
    if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
    if (Array.isArray(result.images) && result.images.length) {
      await Promise.all(result.images.map(image => deleteImage(image.public_id)))
    }
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const repairService = {
  createRequest,
  updateRequest,
  hideRequest,
  getRequestById,
  getAllRequests,
  deleteRequest
}