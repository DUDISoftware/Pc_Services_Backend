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

const getCategories = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)

    const data = await categoryService.getCategories(page, limit)

    res.status(StatusCodes.OK).json({
      status: 'success',
      ...data // { page, limit, total, totalPages, categories }
    })
  } catch (error) {
    next(error)
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await categoryService.getCategoryById(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      category
    })
  } catch (error) {
    next(error)
  }
}

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const category = await categoryService.getCategoryBySlug(slug)
    res.status(StatusCodes.OK).json({
      status: 'success',
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

const searchCategories = async (req, res, next) => {
  try {
    const { query } = req.query
    if (!query || query.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: 'Query parameter is required'
      })
    }
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const categories = await searchService(query, page, limit)
    res.status(StatusCodes.OK).json({
      status: 'success',
      page,
      limit,
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
