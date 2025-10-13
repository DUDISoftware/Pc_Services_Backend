import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/category.service'
import { searchCategories as searchService } from '~/services/search.service'

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

// GET /categories?fields=name,slug&page=1&limit=10
const getCategories = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, fields, filter } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    // Parse fields to array if provided
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

// GET /categories/:id?fields=name,slug
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

// GET /categories/slug/:slug?fields=name,slug
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

// GET /categories/search?query=abc&page=1&limit=10&fields=name,slug&filter={"status":"active"}
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

export const categoryController = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  searchCategories
}
