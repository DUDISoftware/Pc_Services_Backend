// src/controllers/serviceCategory.controller.js
import { StatusCodes } from 'http-status-codes'
import { serviceCategoryService } from '~/services/serviceCategory.service.js'
import { searchServiceCategories as searchService } from '~/services/search.service.js'

/**
 * Controller: Tạo danh mục dịch vụ mới.
 *
 * ✅ Body: thông tin danh mục (vd: name, description, status, slug, ...)
 * ✅ Response: 201 Created → { status, message, category }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createCategory = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.createCategory(req.body)
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Tạo danh mục dịch vụ thành công',
      category
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Cập nhật danh mục dịch vụ theo ID.
 *
 * ✅ Route: PUT /service-categories/:id
 * ✅ Body: các trường cần cập nhật
 * ✅ Response: 200 OK → { status, message, category }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const updateCategory = async (req, res, next) => {
  try {
    const category = await serviceCategoryService.updateCategory(
      req.params.id,
      req.body
    )
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Cập nhật danh mục thành công',
      category
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy tất cả danh mục dịch vụ (hỗ trợ chọn field và filter JSON).
 *
 * ✅ Query:
 * - fields: "name,slug,..." (tùy chọn)
 * - filter: JSON string, ví dụ {"status":"active"} (tùy chọn)
 *
 * ✅ Response: 200 OK → { status, categories }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAllCategories = async (req, res, next) => {
  try {
    const { fields, filter } = req.query

    const selectFields = fields ? fields.split(',') : undefined

    let filterObj = undefined
    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Filter must be a valid JSON string'
        })
      }
    }

    const categories = await serviceCategoryService.getAllCategories(filterObj, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', categories })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết danh mục theo ID (hỗ trợ chọn field).
 *
 * ✅ Route: GET /service-categories/:id
 * ✅ Query: fields (tùy chọn)
 * ✅ Response: 200 OK → { status, category }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const category = await serviceCategoryService.getCategoryById(req.params.id, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', category })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Lấy chi tiết danh mục theo slug (hỗ trợ chọn field).
 *
 * ✅ Route: GET /service-categories/slug/:slug
 * ✅ Query: fields (tùy chọn)
 * ✅ Response: 200 OK → { status, category }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { fields } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const category = await serviceCategoryService.getCategoryBySlug(req.params.slug, selectFields)
    res.status(StatusCodes.OK).json({ status: 'success', category })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Xóa danh mục dịch vụ theo ID.
 *
 * ✅ Route: DELETE /service-categories/:id
 * ✅ Response: 200 OK → { status, message }
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const deleteCategory = async (req, res, next) => {
  try {
    await serviceCategoryService.deleteCategory(req.params.id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xóa danh mục dịch vụ thành công'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Controller: Tìm kiếm danh mục dịch vụ (hỗ trợ fields & filter JSON).
 *
 * ✅ Route: GET /service-categories/search
 * ✅ Query:
 * - query (bắt buộc), page (mặc định 1), limit (mặc định 10)
 * - fields: "name,slug"
 * - filter: JSON string
 *
 * ✅ Response: 200 OK → { status, results }
 * ❌ 400 Bad Request nếu query rỗng hoặc filter sai định dạng.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const searchCategories = async (req, res, next) => {
  try {
    let { query, page = 1, limit = 10, fields, filter } = req.query

    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }

    const selectFields = fields ? fields.split(',') : undefined

    let filterObj = undefined
    if (filter) {
      try {
        filterObj = JSON.parse(filter)
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: 'fail',
          message: 'Filter must be a valid JSON string'
        })
      }
    }

    const results = await searchService(query, page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      results
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bộ controller cho module Service Category.
 *
 * Bao gồm:
 * - createCategory: tạo danh mục
 * - updateCategory: cập nhật danh mục theo ID
 * - getAllCategories: lấy danh sách (lọc/fields)
 * - getCategoryById: lấy theo ID (fields)
 * - getCategoryBySlug: lấy theo slug (fields)
 * - deleteCategory: xóa theo ID
 * - searchCategories: tìm kiếm (fields, filter JSON)
 */
export const serviceCategoryController = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory,
  searchCategories
}
