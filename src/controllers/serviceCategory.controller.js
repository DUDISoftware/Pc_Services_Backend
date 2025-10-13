// src/controllers/serviceCategory.controller.js
import { StatusCodes } from 'http-status-codes'
import { serviceCategoryService } from '~/services/serviceCategory.service.js'
import { searchServiceCategories as searchService } from '~/services/search.service.js'

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

// Modified: getAllCategories now supports fields and filter
const getAllCategories = async (req, res, next) => {
  try {
    const { fields, filter } = req.query
    
    // Parse fields as array if provided
    const selectFields = fields ? fields.split(',') : undefined
    // Parse filter as JSON if provided
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

// Modified: getCategoryById supports fields
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

// Modified: getCategoryBySlug supports fields
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

// Modified: searchCategories supports fields and filter as JSON
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

    // Pass filterObj and selectFields directly, not as an object
    const results = await searchService(query, page, limit, filterObj, selectFields)
    res.status(StatusCodes.OK).json({
      status: 'success',
      results
    })
  } catch (error) {
    next(error)
  }
}

export const serviceCategoryController = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory,
  searchCategories
}
