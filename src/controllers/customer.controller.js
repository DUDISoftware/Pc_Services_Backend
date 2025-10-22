import { StatusCodes } from 'http-status-codes'
import { customerService } from '~/services/customer.service.js'

/**
 * Controller: Tạo mới khách hàng (Customer).
 *
 * ✅ Request body:
 * - `name`, `email`, `phone`, `address`, ... (tuỳ theo schema của Customer).
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message: 'Tạo khách hàng thành công', customer }`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @returns {Promise<void>}
 */
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

/**
 * Controller: Lấy danh sách khách hàng (có hỗ trợ phân trang, lọc và chọn field).
 *
 * ✅ Query params:
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `filter`: JSON string (ví dụ: `{"status":"active"}`)
 * - `fields`: danh sách trường, cách nhau bởi dấu phẩy (ví dụ: `name,email`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, data, fields, filter }`
 * - 400 Bad Request: nếu `filter` không phải JSON hợp lệ
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
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

/**
 * Controller: Lấy thông tin chi tiết khách hàng theo ID.
 *
 * ✅ Route: `GET /customers/:id`
 * ✅ Query params:
 * - `fields`: danh sách trường muốn lấy (ví dụ: `name,email,phone`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, customer, fields }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
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

/**
 * Controller: Cập nhật thông tin khách hàng.
 *
 * ✅ Route: `PUT /customers/:id`
 * ✅ Request body: chứa các trường cần cập nhật (ví dụ: `name`, `email`, `status`, v.v.)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Cập nhật thông tin khách hàng thành công', updatedCustomer }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
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

/**
 * Controller: Xoá khách hàng theo ID.
 *
 * ✅ Route: `DELETE /customers/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Xóa khách hàng thành công', deletedCustomer }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
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

/**
 * Bộ controller cho module Customer.
 *
 * Bao gồm:
 * - `createCustomer`: tạo khách hàng mới
 * - `getAllCustomers`: lấy danh sách khách hàng (phân trang, lọc, chọn field)
 * - `getCustomerById`: lấy thông tin khách hàng theo ID
 * - `updateCustomer`: cập nhật thông tin khách hàng
 * - `deleteCustomer`: xóa khách hàng
 */
export const customerController = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
}
