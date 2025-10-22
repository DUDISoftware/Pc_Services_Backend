import { StatusCodes } from 'http-status-codes'
import { repairService } from '~/services/repair.service.js'
import { searchRequests as searchService } from '~/services/search.service.js'

/**
 * Controller: Tạo yêu cầu sửa chữa mới (Repair Request).
 *
 * ✅ Request:
 * - `req.body`: chứa thông tin yêu cầu (`name`, `phone`, `email`, `address`, `problem_description`, `service_id`, `repair_type`, v.v.)
 * - `req.files`: danh sách ảnh mô tả lỗi (tùy chọn).
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message, request }`
 *
 * ⚠️ Nếu thiếu dữ liệu bắt buộc (ví dụ `name` hoặc `service_id`) → ném lỗi qua middleware `next(error)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 */
const createRequest = async (req, res, next) => {
  try {
    const request = await repairService.createRequest(req.body, req.files)
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
 * Controller: Cập nhật yêu cầu sửa chữa theo ID.
 *
 * ✅ Route: `PUT /repairs/:id`
 * ✅ Request:
 * - `req.params.id`: ID yêu cầu cần cập nhật.
 * - `req.body`: thông tin cần cập nhật (vd: `status`, `problem_description`, `address`, v.v.)
 * - `req.files`: danh sách ảnh mới (tùy chọn).
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message, updatedRequest }`
 */
const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedRequest = await repairService.updateRequest(id, req.body, req.files)
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
 * Controller: Ẩn yêu cầu sửa chữa (soft delete).
 *
 * ✅ Route: `PATCH /repairs/hide/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message, hiddenRequest }`
 *
 * ⚠️ Không xóa khỏi DB, chỉ cập nhật trạng thái ẩn.
 */
const hideRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    const hiddenRequest = await repairService.hideRequest(id)
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
 * Controller: Lấy danh sách tất cả yêu cầu sửa chữa (phân trang, lọc, chọn trường).
 *
 * ✅ Route: `GET /repairs`
 * ✅ Query params:
 * - `page`: số trang (mặc định 1)
 * - `limit`: số lượng mỗi trang (mặc định 10)
 * - `filter`: JSON string để lọc (vd: `{"status":"new"}`)
 * - `fields`: danh sách trường cần lấy (vd: `name,phone,status`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, page, limit, filter, fields, requests }`
 */
const getAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, filter = {}, fields = '' } = req.query
    const filterObj = typeof filter === 'string' ? JSON.parse(filter) : filter
    const selectFields = fields ? fields.split(',') : undefined

    const requests = await repairService.getAllRequests(Number(page), Number(limit), filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      page: Number(page),
      limit: Number(limit),
      filter: filterObj,
      fields: fields.split(','),
      requests
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thông tin chi tiết của một yêu cầu sửa chữa.
 *
 * ✅ Route: `GET /repairs/:id`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy (vd: `name,phone,status`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, id, request }`
 * - 404 Not Found: nếu không tồn tại yêu cầu.
 */
const getRequestById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields = '' } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const request = await repairService.getRequestById(id, selectFields)

    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Yêu cầu không tồn tại',
        id
      })
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      id,
      request
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tìm kiếm yêu cầu sửa chữa theo từ khóa.
 *
 * ✅ Route: `GET /repairs/search?query=abc&page=1&limit=10`
 *
 * ✅ Query params:
 * - `query`: từ khóa tìm kiếm (vd: tên khách hàng, mô tả lỗi,...)
 * - `page`, `limit`: phân trang
 *
 * ✅ Response:
 * - 200 OK: `{ status, query, page, limit, results }`
 */
const searchRequests = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 10 } = req.query
    const results = await searchService(query, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      query,
      page: Number(page),
      limit: Number(limit),
      results
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách yêu cầu sửa chữa theo dịch vụ.
 *
 * ✅ Route: `GET /repairs/service/:serviceId`
 * ✅ Query params:
 * - `page`: số trang
 * - `limit`: số lượng mỗi trang
 *
 * ✅ Response:
 * - 200 OK: `{ status, serviceId, page, limit, requests }`
 */
const getRequestsByService = async (req, res, next) => {
  try {
    const { serviceId } = req.params
    const { page = 1, limit = 10 } = req.query
    const requests = await repairService.getRequestsByService(serviceId, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      serviceId,
      page: Number(page),
      limit: Number(limit),
      requests
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách yêu cầu theo trạng thái (`new`, `in_progress`, `completed`, `cancelled`).
 *
 * ✅ Route: `GET /repairs/status/:status`
 * ✅ Query params:
 * - `page`, `limit`
 *
 * ✅ Response:
 * - 200 OK: `{ status, statusParam, page, limit, requests }`
 */
const getRequestsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params
    const { page = 1, limit = 10 } = req.query
    const requests = await repairService.getRequestsByStatus(status, Number(page), Number(limit))
    res.status(StatusCodes.OK).json({
      status: 'success',
      statusParam: status,
      page: Number(page),
      limit: Number(limit),
      requests
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xoá yêu cầu sửa chữa vĩnh viễn theo ID.
 *
 * ✅ Route: `DELETE /repairs/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message, id }`
 */
const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params
    await repairService.deleteRequest(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa yêu cầu thành công',
      id
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Repair (Quản lý yêu cầu sửa chữa).
 *
 * Bao gồm:
 * - `createRequest`: tạo yêu cầu mới
 * - `updateRequest`: cập nhật yêu cầu
 * - `hideRequest`: ẩn yêu cầu
 * - `deleteRequest`: xóa yêu cầu
 * - `getAllRequests`: lấy danh sách yêu cầu (phân trang, lọc)
 * - `getRequestById`: xem chi tiết yêu cầu
 * - `searchRequests`: tìm kiếm yêu cầu
 * - `getRequestsByService`: lấy theo dịch vụ
 * - `getRequestsByStatus`: lấy theo trạng thái
 */
export const repairController = {
  createRequest,
  updateRequest,
  hideRequest,
  deleteRequest,
  getAllRequests,
  getRequestById,
  searchRequests,
  getRequestsByService,
  getRequestsByStatus
}
