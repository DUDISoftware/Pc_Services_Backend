import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
const createService = async (reqBody) => {
  const { category, ...rest } = reqBody
  const service = new ServiceModel({
    ...rest,
    category
  })
  await service.save()
  return service.populate('category', 'name')
}

const updateService = async (id, reqBody) => {
  const { category, ...rest } = reqBody
  const updateData = {
    ...rest,
    ...(category && { category }),
    updated_at: Date.now(),
  }
  const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate('category', 'name')
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const hideService = async (id) => {
  const service = await ServiceModel.findById(id)
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  service.status = 'hidden'
  await service.save()
  return service
}

// src/services/customerService.service.js
const getAllServices = async (filter = {}) => {
  return await ServiceModel.find(filter)
    .populate('category', 'name description status') // ✅ lấy thêm thông tin category
    .sort({ created_at: -1 })
}

const getServiceById = async (id) => {
  const service = await ServiceModel.findById(id).populate(
    'category',
    'name description status'
  )
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const deleteService = async (id) => {
  const service = await ServiceModel.findByIdAndDelete(id)
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

export const serviceService = {
  createService,
  updateService,
  hideService,
  getAllServices,
  getServiceById,
  deleteService
}
