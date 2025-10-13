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
    let { page = 1, limit = 10, filter = '{}', fields = '' } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    filter = typeof filter === 'string' ? JSON.parse(filter) : filter
    fields = typeof fields === 'string' ? fields.split(',').join(' ') : fields
    const data = await customerService.getAllCustomers(page, limit, filter, fields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy danh sách khách hàng thành công',
      data,
      fields,
      filter
    })
  } catch (error) {
    next(error)
  }
}

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params
    let { fields = '' } = req.query
    fields = typeof fields === 'string' ? fields.split(',').join(' ') : fields
    const customer = await customerService.getCustomerById(id, fields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Lấy thông tin khách hàng thành công',
      customer,
      fields
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