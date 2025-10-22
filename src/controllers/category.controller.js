import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/category.service'
import { searchCategories as searchService } from '~/services/search.service'

/**
 * Controller: Tạo mới một danh mục dịch vụ (Category).
 *
 * ✅ Request body:
 * - `name`: chuỗi, bắt buộc.
 * - `description`: tùy chọn.
 * - `status`: 'active' | 'inactive' (mặc định: 'active').
 *
 * ✅ Response:
 * - 201 Created: `{ status: 'success', message: 'Tạo danh mục thành công', category }`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @returns {Promise<void>}
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo danh mục thành công',
      category
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy danh sách danh mục (có hỗ trợ phân trang, lọc và chọn trường).
 *
 * ✅ Query params:
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `fields`: chuỗi cách nhau bằng dấu phẩy (ví dụ: `name,slug`)
 * - `filter`: JSON string (ví dụ: `{"status":"active"}`)
 *
 * ✅ Response:
 * - 200 OK: `{ status, page, limit, total, totalPages, categories }`
 * - 400 Bad Request: nếu `filter` không phải JSON hợp lệ
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCategories = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, fields, filter } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    // Chuyển fields thành mảng nếu có
    let selectFields = undefined
    if (fields) {
      selectFields = fields.split(',').map(f => f.trim())
    }

    // Parse filter nếu có
    let filterObj = undefined
    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Filter parameter must be valid JSON'
        })
      }
    }

    const data = await categoryService.getCategories(page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      fields: selectFields || null,
      filter: filterObj || null,
      ...data // { page, limit, total, totalPages, categories }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết danh mục theo ID.
 *
 * ✅ Route: `GET /categories/:id`
 * ✅ Query params:
 * - `fields`: chuỗi cách nhau bằng dấu phẩy (ví dụ: `name,slug`)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', fields, category }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields } = req.query
    let selectFields = undefined
    if (fields) {
      selectFields = fields.split(',').map(f => f.trim())
    }
    const category = await categoryService.getCategoryById(id, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      fields: selectFields || null,
      category
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết danh mục theo slug.
 *
 * ✅ Route: `GET /categories/slug/:slug`
 * ✅ Query params:
 * - `fields`: chuỗi cách nhau bằng dấu phẩy (ví dụ: `name,slug`)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', fields, category }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const { fields } = req.query
    let selectFields = undefined
    if (fields) {
      selectFields = fields.split(',').map(f => f.trim())
    }
    const category = await categoryService.getCategoryBySlug(slug, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      fields: selectFields || null,
      category
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật danh mục theo ID.
 *
 * ✅ Route: `PUT /categories/:id`
 * ✅ Body: chứa các trường cần cập nhật.
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Cập nhật danh mục thành công', category }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const updatedCategory = await categoryService.updateCategory(id, req.body)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật danh mục thành công',
      category: updatedCategory
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xóa danh mục theo ID.
 *
 * ✅ Route: `DELETE /categories/:id`
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', message: 'Xoá danh mục thành công' }`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    await categoryService.deleteCategory(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá danh mục thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tìm kiếm danh mục theo từ khóa.
 *
 * ✅ Route: `GET /categories/search`
 * ✅ Query params:
 * - `query`: chuỗi tìm kiếm (bắt buộc)
 * - `page`: số trang (mặc định: 1)
 * - `limit`: số lượng mỗi trang (mặc định: 10)
 * - `fields`: chuỗi cách nhau bằng dấu phẩy (ví dụ: `name,slug`)
 * - `filter`: JSON string (ví dụ: `{"status":"active"}`)
 *
 * ✅ Response:
 * - 200 OK: `{ status: 'success', results, page, limit, categories }`
 * - 400 Bad Request: nếu `query` rỗng hoặc `filter` không hợp lệ.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
const searchCategories = async (req, res, next) => {
  try {
    const { query, fields, filter } = req.query
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }

    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    let selectFields = undefined
    if (fields) {
      selectFields = fields.split(',').map(f => f.trim())
    }

    let filterObj = undefined
    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Filter parameter must be valid JSON'
        })
      }
    }

    const categories = await searchService(query, page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      page,
      limit,
      fields: selectFields || null,
      filter: filterObj || null,
      results: categories.length,
      categories
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Category.
 *
 * Bao gồm:
 * - `createCategory`: tạo mới danh mục
 * - `getCategories`: lấy danh sách danh mục (phân trang, lọc, chọn field)
 * - `getCategoryById`: lấy chi tiết danh mục theo ID
 * - `getCategoryBySlug`: lấy chi tiết danh mục theo slug
 * - `updateCategory`: cập nhật danh mục
 * - `deleteCategory`: xóa danh mục
 * - `searchCategories`: tìm kiếm danh mục theo từ khóa
 */
export const categoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  searchCategories
}
