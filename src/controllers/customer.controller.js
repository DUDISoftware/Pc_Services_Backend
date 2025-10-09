import { StatusCodes } from 'http-status-codes'
import { customerService } from '~/services/customer.service.js'

const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo khách hàng thành công',
      customer
    })
  } catch (error) {
    next(error)
  }
}

const getAllCustomers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, filter = {}, field = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    filter = typeof filter === 'string' ? JSON.parse(filter) : filter
    field = typeof field === 'string' ? field.split(',').join(' ') : field
    const data = await customerService.getAllCustomers(page, limit, filter, field)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy danh sách khách hàng thành công',
      data
    })
  } catch (error) {
    next(error)
  }
}

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await customerService.getCustomerById(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin khách hàng thành công',
      customer
    })
  } catch (error) {
    next(error)
  }
}
const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedCustomer = await customerService.updateCustomer(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật thông tin khách hàng thành công',
      updatedCustomer
    })
  } catch (error) {
    next(error)
  }
}

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params
    const deletedCustomer = await customerService.deleteCustomer(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa khách hàng thành công',
      deletedCustomer
    })
  } catch (error) {
    next(error)
  }
}

export const customerController = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
}