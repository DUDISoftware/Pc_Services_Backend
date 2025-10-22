import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import ServiceCategoryModel from '~/models/ServiceCategory.model.js'
import ServiceModel from '~/models/Service.model'

/**
 * Creates a new service category.
 *
 * This function inserts a new category document into the database using the provided request body.
 * Throws an error if the operation fails.
 *
 * @async
 * @param {Object} reqBody - The data for the new category.
 * @returns {Promise<Object>} The created category document.
 * @throws {ApiError} If an internal error occurs.
 */
const createCategory = async (reqBody) => {
  try {
    const category = await ServiceCategoryModel.create(reqBody)
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates an existing service category by its ID.
 *
 * This function finds a category by its ID and updates it with the provided request body.
 * Throws an error if the category is not found or if the operation fails.
 *
 * @async
 * @param {string} id - The ID of the category to update.
 * @param {Object} reqBody - The updated data for the category.
 * @returns {Promise<Object>} The updated category document.
 * @throws {ApiError} If the category is not found or an internal error occurs.
 */
const updateCategory = async (id, reqBody) => {
  try {
    const updated = await ServiceCategoryModel.findByIdAndUpdate(id, reqBody, { new: true })
    if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return updated
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves all service categories.
 *
 * This function fetches all categories from the database, optionally filtered and with selected fields.
 * Throws an error if the operation fails.
 *
 * @async
 * @param {Object} [filter={}] - Optional filter for categories.
 * @param {string} [fields=''] - Optional fields to select.
 * @returns {Promise<Array>} Array of category documents.
 * @throws {ApiError} If an internal error occurs.
 */
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

/**
 * Retrieves a service category by its ID.
 *
 * This function finds a category by its ID and returns it with optional selected fields.
 * Throws an error if the category is not found or if the operation fails.
 *
 * @async
 * @param {string} id - The ID of the category to retrieve.
 * @param {string|null} [fields=null] - Optional fields to select.
 * @returns {Promise<Object>} The category document.
 * @throws {ApiError} If the category is not found or an internal error occurs.
 */
const getCategoryById = async (id, fields = null) => {
  try {
    const category = await ServiceCategoryModel.findById(id).select(fields)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a service category by its slug.
 *
 * This function finds a category by its slug and returns it with optional selected fields.
 * Throws an error if the category is not found or if the operation fails.
 *
 * @async
 * @param {string} slug - The slug of the category to retrieve.
 * @param {string|null} [fields=null] - Optional fields to select.
 * @returns {Promise<Object>} The category document.
 * @throws {ApiError} If the category is not found or an internal error occurs.
 */
const getCategoryBySlug = async (slug, fields = null) => {
  try {
    const category = await ServiceCategoryModel.findOne({ slug }).select(fields)
    if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a service category by its ID.
 *
 * This function checks if there are any services associated with the category.
 * If services exist, it throws an error and prevents deletion.
 * If no services exist, it deletes the category from the database.
 * Throws an error if the category is not found or if any internal error occurs.
 *
 * @async
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<Object>} The deleted category document.
 * @throws {ApiError} If services exist in the category, the category is not found, or an internal error occurs.
 */
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
