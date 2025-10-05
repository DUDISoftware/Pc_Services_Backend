// src/services/serviceCategory.service.js
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceCategoryModel from '~/models/ServiceCategory.model.js'
import ServiceModel from '~/models/Service.model'

const createCategory = async (reqBody) => {
  const category = await ServiceCategoryModel.create(reqBody)
  return category
}

const updateCategory = async (id, reqBody) => {
  const updated = await ServiceCategoryModel.findByIdAndUpdate(id, reqBody, { new: true })
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  return updated
}

const getAllCategories = async () => {
  return ServiceCategoryModel.find().sort({ createdAt: -1 })
}

const getCategoryById = async (id) => {
  const category = await ServiceCategoryModel.findById(id)
  if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  return category
}

const getCategoryBySlug = async (slug) => {
  const category = await ServiceCategoryModel.findOne({ slug })
  if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  return category
}

const deleteCategory = async (id) => {
  const hasServices = await ServiceModel.exists({ category: id })
  if (hasServices) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot delete, services exist in this category')
  }
  const deleted = await ServiceCategoryModel.findByIdAndDelete(id)
  if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
  return deleted
}

export const serviceCategoryService = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory
}
