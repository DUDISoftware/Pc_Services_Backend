import { StatusCodes } from 'http-status-codes'
import { serviceService } from '~/services/customerService.service'
import { searchService } from '~/services/search.service.js'

/**
 * Controller: Tạo dịch vụ mới (Service).
 *
 * ✅ Request:
 * - `req.body`: thông tin dịch vụ (`name`, `description`, `price`, `type`, `estimated_time`, `category_id`, `slug`, v.v.)
 * - `req.files`: ảnh dịch vụ (tùy chọn)
 *
 * ✅ Response:
 * - 201 Created: `{ status, message, service }`
 *
 * ⚠️ Nếu thiếu thông tin bắt buộc (như `name` hoặc `category_id`) → ném lỗi qua middleware.
 */
const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body, req.files)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo dịch vụ thành công',
      service
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật thông tin dịch vụ theo ID.
 *
 * ✅ Route: `PUT /services/:id`
 * ✅ Request:
 * - `req.params.id`: ID dịch vụ
 * - `req.body`: các trường cần cập nhật
 * - `req.files`: ảnh cập nhật (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status, message, service }`
 */
const updateService = async (req, res, next) => {
  try {
    const { id } = req.params
    const updated = await serviceService.updateService(id, req.body, req.files)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật dịch vụ thành công',
      service: updated
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Ẩn dịch vụ khỏi danh sách hiển thị.
 *
 * ✅ Route: `PATCH /services/hide/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message }`
 */
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

/**
 * Controller: Lấy danh sách tất cả dịch vụ (có hỗ trợ `fields` và `filter` dạng JSON).
 *
 * ✅ Route: `GET /services`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy (vd: `name,price,type`)
 * - `filter`: chuỗi JSON để lọc (vd: `{"status":"active"}`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, services, fields, filter }`
 */
const getAllServices = async (req, res, next) => {
  try {
    const { fields, filter, page, limit, order } = req.query
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const sortOrder = order ? JSON.parse(order) : undefined
    const services = await serviceService.getAllServices(limit, page, filterObj, selectFields, sortOrder)
    return res.status(StatusCodes.OK).json(services)
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thông tin dịch vụ theo ID.
 *
 * ✅ Route: `GET /services/:id`
 * ✅ Query params:
 * - `fields`: danh sách trường muốn lấy (vd: `name,price,type`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, service, fields }`
 */
const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const service = await serviceService.getServiceById(id, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      service,
      fields: selectFields
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy thông tin dịch vụ theo slug.
 *
 * ✅ Route: `GET /services/slug/:slug`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy
 *
 * ✅ Response:
 * - 200 OK: `{ status, service, fields }`
 */
const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const service = await serviceService.getServiceBySlug(slug, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      service,
      fields: selectFields
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xóa dịch vụ theo ID.
 *
 * ✅ Route: `DELETE /services/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status, message }`
 */
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

/**
 * Controller: Tìm kiếm dịch vụ theo từ khóa.
 *
 * ✅ Route: `GET /services/search?query=abc`
 * ✅ Query params:
 * - `query`: chuỗi tìm kiếm (bắt buộc)
 * - `page`, `limit`: phân trang (mặc định: 1, 10)
 * - `fields`: danh sách trường cần lấy
 * - `filter`: chuỗi JSON để lọc
 *
 * ✅ Response:
 * - 200 OK: `{ status, results, fields, filter }`
 * - 400 Bad Request: nếu thiếu `query` hoặc `filter` sai định dạng.
 */
const searchServices = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10, fields, filter } = req.query
    limit = Number(limit)
    page = Number(page)
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const results = await searchService.searchServices(query, page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      total: results.total,
      page: page,
      limit: limit,
      services: results.services,
      fields: selectFields,
      filter: filterObj
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Đếm lượt xem dịch vụ bằng Redis (real-time view counter).
 *
 * ✅ Route: `POST /services/:id/view`
 * ✅ Request body: có thể kèm thông tin người xem (tùy chọn)
 *
 * ✅ Response:
 * - 200 OK: `{ status, views }`
 */
const countViewRedis = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    const views = await serviceService.countViewRedis(id, data)
    res.status(StatusCodes.OK).json({
      status: 'success',
      views
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy tổng lượt xem của dịch vụ.
 *
 * ✅ Route: `GET /services/:id/views`
 * ✅ Query params:
 * - `fields`: danh sách trường cần lấy
 *
 * ✅ Response:
 * - 200 OK: `{ status, views, fields }`
 */
const getServiceViews = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const views = await serviceService.getServiceViews(id, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      views,
      fields: selectFields
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách dịch vụ nổi bật (featured).
 *
 * ✅ Route: `GET /services/featured`
 * ✅ Query params:
 * - `limit`: số lượng dịch vụ cần lấy
 * - `fields`: danh sách trường cần lấy
 * - `filter`: chuỗi JSON để lọc
 *
 * ✅ Response:
 * - 200 OK: `{ status, services, fields, filter }`
 */
const getFeaturedServices = async (req, res, next) => {
  try {
    const { limit, fields, filter } = req.query
    const filterObj = filter ? JSON.parse(filter) : undefined
    const selectFields = fields ? fields.split(',') : undefined
    const featured = await serviceService.getFeaturedServices(limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      services: featured,
      fields: selectFields,
      filter: filterObj
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xuất danh sách dịch vụ ra file Excel.
 *
 * ✅ Route: `GET /services/export`
 *
 * ✅ Response:
 * - 200 OK: file Excel (`services.xlsx`)
 * - Header: `Content-Disposition: attachment; filename=services.xlsx`
 */
const exportServicesToExcel = async (req, res, next) => {
  try {
    const buffer = await serviceService.exportServicesToExcel()
    res.setHeader('Content-Disposition', 'attachment; filename=services.xlsx')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.status(StatusCodes.OK).send(buffer)
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Service (Quản lý dịch vụ).
 *
 * Bao gồm:
 * - `createService`: tạo dịch vụ mới
 * - `updateService`: cập nhật dịch vụ
 * - `hideService`: ẩn dịch vụ
 * - `getAllServices`: lấy danh sách dịch vụ
 * - `getServiceById`: lấy dịch vụ theo ID
 * - `getServiceBySlug`: lấy dịch vụ theo slug
 * - `deleteService`: xóa dịch vụ
 * - `searchServices`: tìm kiếm dịch vụ
 * - `countViewRedis`: đếm lượt xem
 * - `getServiceViews`: lấy lượt xem tổng
 * - `getFeaturedServices`: lấy dịch vụ nổi bật
 * - `exportServicesToExcel`: xuất danh sách ra Excel
 */
export const serviceController = {
  createService,
  updateService,
  hideService,
  getAllServices,
  getServiceById,
  getServiceBySlug,
  deleteService,
  searchServices,
  countViewRedis,
  getServiceViews,
  getFeaturedServices,
  exportServicesToExcel
}
