import { StatusCodes } from 'http-status-codes'
import { orderService } from '~/services/order.service.js'
import { searchRequests as searchService } from '~/services/search.service.js'

/**
 * Controller: Tạo mới yêu cầu đặt hàng hoặc dịch vụ (Order Request).
 *
 * ✅ Request body:
 * - Chứa các thông tin yêu cầu (ví dụ: `name`, `email`, `phone`, `address`, `items`, `status`, v.v.)
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message: 'Tạo yêu cầu thành công', request }`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @returns {Promise<void>}
 */
const createRequest = async (req, res, next) => {
  try {
    const request = await orderService.createRequest(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo yêu cầu thành công',
      request
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thông tin yêu cầu đặt hàng/dịch vụ.
 *
 * ✅ Route: `PUT /orders/:id`
 * ✅ Request body: chứa các trường cần cập nhật (ví dụ: `status`, `address`, `notes`, v.v.)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Cập nhật yêu cầu thành công', updatedRequest }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedRequest = await orderService.updateRequest(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật yêu cầu thành công',
      updatedRequest
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Ẩn yêu cầu khỏi danh sách hiển thị (soft delete).
 *
 * ✅ Route: `PATCH /orders/hide/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Yêu cầu đã được ẩn', hiddenRequest }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const hideRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const hiddenRequest = await orderService.hideRequest(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Yêu cầu đã được ẩn',
      hiddenRequest
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách tất cả yêu cầu (có hỗ trợ phân trang, lọc và chọn field).
 *
 * ✅ Query params:
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `filter`: JSON string để lọc (ví dụ: `{"status":"completed"}`)
 * - `fields`: danh sách trường cần lấy (ví dụ: `name,status,email`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, page, limit, filter, fields, requests }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, filter, fields } = req.query
    let filterObj = {}
    let fieldsArr

    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        filterObj = {}
      }
    }

    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }

    const requests = await orderService.getAllRequests(Number(page), Number(limit), filterObj, fieldsArr)

    res.status(StatusCodes.OK).json({
      status: 'success',
      page: Number(page),
      limit: Number(limit),
      filter: filterObj,
      fields: fieldsArr,
      requests
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết một yêu cầu theo ID.
 *
 * ✅ Route: `GET /orders/:id`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy (ví dụ: `name,status,address`)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', id, fields, request }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }

    const request = await orderService.getRequestById(id, fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      id,
      fields: fieldsArr,
      request
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tìm kiếm yêu cầu theo từ khóa (search bar).
 *
 * ✅ Route: `GET /orders/search?query=abc&page=1&limit=10&fields=name,status`
 *
 * ✅ Query params:
 * - `query`: từ khóa tìm kiếm (bắt buộc)
 * - `page`, `limit`: phân trang (mặc định: 1, 10)
 * - `fields`: danh sách trường cần lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status, query, page, limit, fields, results }`
 * - 400 Bad Request: nếu `query` rỗng
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const searchRequests = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10, fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }

    const results = await searchService(query, Number(page), Number(limit), fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      query,
      page: Number(page),
      limit: Number(limit),
      fields: fieldsArr,
      results
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách yêu cầu theo trạng thái.
 *
 * ✅ Route: `GET /orders/status/:status`
 * ✅ Query params:
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `fields`: danh sách trường cần lấy (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status, statusParam, page, limit, fields, requests }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getRequestsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params
    const { page = 1, limit = 10, fields } = req.query
    let fieldsArr
    if (fields) {
      fieldsArr = fields.split(',').map(f => f.trim())
    }

    const requests = await orderService.getRequestsByStatus(status, Number(page), Number(limit), fieldsArr)
    res.status(StatusCodes.OK).json({
      status: 'success',
      statusParam: status,
      page: Number(page),
      limit: Number(limit),
      fields: fieldsArr,
      requests
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Order (Yêu cầu đặt hàng/dịch vụ).
 *
 * Bao gồm:
 * - `createRequest`: tạo yêu cầu mới
 * - `updateRequest`: cập nhật yêu cầu
 * - `hideRequest`: ẩn yêu cầu (soft delete)
 * - `getAllRequests`: lấy danh sách yêu cầu (phân trang, lọc, chọn field)
 * - `getRequestById`: lấy chi tiết yêu cầu theo ID
 * - `searchRequests`: tìm kiếm yêu cầu theo từ khóa
 * - `getRequestsByStatus`: lấy danh sách yêu cầu theo trạng thái
 */
export const orderController = {
  createRequest,
  updateRequest,
  hideRequest,
  getAllRequests,
  getRequestById,
  searchRequests,
  getRequestsByStatus
}
