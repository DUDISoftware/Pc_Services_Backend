import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Repair from '~/models/RepairRequest.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

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

// Added .select() to specify fields for all get methods
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

const getRequestById = async (id, fields = '') => {
  try {
    return await Repair.findById(id).select(fields)
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

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