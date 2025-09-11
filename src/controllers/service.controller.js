import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo dịch vụ thành công',
      service
    })
  } catch (error) {
    next(error)
  }
}

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await serviceService.updateService(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật dịch vụ thành công',
      service: updated
    })
  } catch (error) {
    next(error)
  }
}

const hideService = async (req, res, next) => {
  try {
    const { id } = req.params
    await serviceService.hideService(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Ẩn dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getAllServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAllServices()
    res.status(StatusCodes.OK).json({ status: 'success', services })
  } catch (error) {
    next(error)
  }
}

const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params
    const service = await serviceService.getServiceById(id)
    res.status(StatusCodes.OK).json({ status: 'success', service })
  } catch (error) {
    next(error)
  }
}

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params
    await serviceService.deleteService(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const serviceController = {
  createService,
  updateService,
  hideService,
  getAllServices,
  getServiceById,
  deleteService
}
