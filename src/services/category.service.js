import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CategoryModel from '~/models/Category.model'
import ProductModel from '~/models/Product.model'

/**
 * Create category
 */
const createCategory = async (reqBody) => {
  try {
    const category = await CategoryModel.create(reqBody)
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Get all categories with pagination
 */
const getCategories = async (page = 1, limit = 10, filter = {}) => {
  try {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      CategoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CategoryModel.countDocuments(filter)
    ])

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Get category by id
 */
const getCategoryById = async (id) => {
  try {
    const category = await CategoryModel.findById(id)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Get category by slug
 */
const getCategoryBySlug = async (slug) => {
  try {
    const category = await CategoryModel.findOne({ slug })
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Update category
 */
const updateCategory = async (id, reqBody) => {
  try {
    reqBody.updatedAt = Date.now()
    const category = await CategoryModel.findByIdAndUpdate(id, reqBody, { new: true })
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Delete category and detach products
 */
const deleteCategory = async (id) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id)
    if (!deletedCategory) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }

    await ProductModel.updateMany(
      { category_id: id },
      { $set: { category_id: null } }
    )

    return deletedCategory
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
}
