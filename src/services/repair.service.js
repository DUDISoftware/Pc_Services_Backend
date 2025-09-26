import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Repair from '~/models/RepairRequest.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

const createRequest = async (reqBody, files) => {
  const requestData = {
    ...reqBody,
    images: files?.map(file => ({
      url: file.path,
      public_id: file.filename
    })) || []
  }
  const newRequest = new Repair(requestData)
  await newRequest.save()
  return newRequest
}

const updateRequest = async (id, reqBody, files) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  if (files && files.length > 0) {
    updateData.images = files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  }

  const updated = await Repair.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const hideRequest = async (id) => {
  const updateData = {
    hidden: true,
    updatedAt: Date.now()
  }
  const updated = await Repair.findByIdAndUpdate(id, updateData, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  return updated
}

const getAllRequests = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const requests = await Repair.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  return requests
}

const getRequestById = async (id) => {
  const request = await Repair.findById(id)
  return request
}

const deleteRequest = async (id) => {
  const result = await Repair.findByIdAndDelete(id)
  if (!result) throw new ApiError(StatusCodes.NOT_FOUND, 'Request not found')
  // Delete images from cloudinary
  if (result.images && result.images.length > 0) {
    await Promise.all(result.images.map(image => deleteImage(image.public_id)))
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