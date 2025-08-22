import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceModel from '~/models/Service.model.js'
import { deleteImage } from '~/utils/cloudinary.js'

const createService = async (reqBody) => {
  const serviceData = {
    ...reqBody
  }
  const service = new ServiceModel(serviceData)
  await service.save()
  return service
}

const updateService = async (id, reqBody) => {
  const updateData = {
    ...reqBody,
    updated_at: Date.now()
  }

  const service = await ServiceModel.findByIdAndUpdate(id, updateData, { new: true })
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  }
  return service
}

const hideService = async (id) => {
  const service = await ServiceModel.findById(id)
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found')
  }
  service.status = 'hidden'
  await service.save()
  return service
}

export const serviceService = {
  createService,
  updateService,
  hideService
}