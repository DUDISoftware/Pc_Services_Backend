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
  return service.populate('category_id', 'name')
}

const updateService = async (id, reqBody) => {
  const { category_id, ...rest } = reqBody
  const updateData = {
    ...rest,
    ...(category_id && { category_id }),
    updated_at: Date.now(),
  }
  const service = await ServiceModel.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate('category_id', 'name')
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
    .populate('category_id', 'name description status') // ✅ lấy thêm thông tin category
    .sort({ created_at: -1 })
}

const getServiceById = async (id) => {
  console.log('Fetching service with ID:', id); // Debug log
  const service = await ServiceModel.findById(id).populate(
    'category_id',
    'name description status'
  )
  if (!service) throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  return service
}

const getServiceBySlug = async (slug) => {
  const service = await ServiceModel.findOne({ slug }).populate(
    'category_id',
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
  getServiceBySlug,
  getAllServices,
  getServiceById,
  deleteService
}
