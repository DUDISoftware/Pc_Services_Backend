import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CategoryModel from '~/models/Category.model'
import ProductModel from '~/models/Product.model'

/**
 * Create category
 */
const createCategory = async (reqBody) => {
  const category = new CategoryModel(reqBody)
  await category.save()
  return category
}

/**
 * Get all categories with pagination
 */
const getCategories = async (page = 1, limit = 10) => {
  page = parseInt(page)
  limit = parseInt(limit)
  const skip = (page - 1) * limit

  const [categories, total] = await Promise.all([
    CategoryModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    CategoryModel.countDocuments()
  ])

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    categories
  }
}

/**
 * Get category by id
 */
const getCategoryById = async (id) => {
  const category = await CategoryModel.findById(id)
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  return category
}

const getCategoryBySlug = async (slug) => {
  const category = await CategoryModel.findOne({ slug })
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  return category
}

/**
 * Update category
 */
const updateCategory = async (id, reqBody) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  const category = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true })
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }
  return category
}

/**
 * Delete category + detach products
 */
const deleteCategory = async (id) => {
  const deletedCategory = await CategoryModel.findByIdAndDelete(id)
  if (!deletedCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  }

  // Gỡ liên kết category ở product thay vì xóa product
  await ProductModel.updateMany(
    { category_id: id },
    { $set: { category_id: null } }
  )

  return deletedCategory
}

export const categoryService = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
}
