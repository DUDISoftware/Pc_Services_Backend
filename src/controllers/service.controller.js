import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'

const createService = async (req, res, next) => {
  try {
    const Service = await serviceService.createService(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo dịch vụ thành công',
      Service
    })
  } catch (error) {
    next(error)
  }
}

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedService = await serviceService.updateService(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật dịch vụ thành công',
      Service: updatedService
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

export const serviceController = {
  createService,
  updateService,
  hideService
}
