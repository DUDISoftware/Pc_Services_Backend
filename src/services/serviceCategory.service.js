import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceCategoryModel from '~/models/ServiceCategory.model.js'
import ServiceModel from '~/models/Service.model'

const createCategory = async (reqBody) => {
  try {
    const category = await ServiceCategoryModel.create(reqBody)
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const updateCategory = async (id, reqBody) => {
  try {
    const updated = await ServiceCategoryModel.findByIdAndUpdate(id, reqBody, { new: true })
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getAllCategories = async (filter = {}, fields = '') => {
  try {
    const categories = await ServiceCategoryModel
                        .find(filter)
                        .select(fields)
                        .sort({ createdAt: -1 })
    return categories
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getCategoryById = async (id, fields = null) => {
  try {
    const category = await ServiceCategoryModel.findById(id).select(fields)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getCategoryBySlug = async (slug, fields = null) => {
  try {
    const category = await ServiceCategoryModel.findOne({ slug }).select(fields)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const deleteCategory = async (id) => {
  try {
    const hasServices = await ServiceModel.exists({ category: id })
    if (hasServices) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot delete, services exist in this category')
    }
    const deleted = await ServiceCategoryModel.findByIdAndDelete(id)
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return deleted
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const serviceCategoryService = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory
}
