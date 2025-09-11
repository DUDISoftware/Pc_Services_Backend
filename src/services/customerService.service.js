import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'

const createService = async (reqBody) => {
  const service = new ServiceModel(reqBody)
  await service.save()
  return service
}

const updateService = async (id, reqBody) => {
  const updateData = { ...reqBody, updated_at: Date.now() }
  const service = await ServiceModel.findByIdAndUpdate(id, updateData, { new: true })
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

const getAllServices = async (filter = {}) => {
  return await ServiceModel.find(filter).sort({ created_at: -1 })
}

const getServiceById = async (id) => {
  const service = await ServiceModel.findById(id)
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
