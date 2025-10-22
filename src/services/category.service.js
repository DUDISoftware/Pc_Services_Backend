import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import CategoryModel from '~/models/Category.model'
import ProductModel from '~/models/Product.model'

/**
 * Creates a new category in the database.
 * @param {Object} reqBody - The data for the new category.
 * @returns {Promise<Object>} The created category document.
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
 * Retrieves all categories with pagination and optional filtering.
 * @param {number} page - The page number.
 * @param {number} limit - Number of categories per page.
 * @param {Object} filter - Filter conditions.
 * @param {string} fields - Fields to select.
 * @returns {Promise<Object>} Paginated categories and metadata.
 */
const getCategories = async (page = 1, limit = 10, filter = {}, fields) => {
  try {
    page = Number(page) || 1
    limit = Number(limit) || 10
    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      CategoryModel.find(filter).sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(fields),
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
 * Retrieves a category by its unique ID.
 * @param {string} id - The category ID.
 * @param {string} fields - Fields to select.
 * @returns {Promise<Object>} The category document.
 */
const getCategoryById = async (id, fields) => {
  try {
    const category = await CategoryModel.findById(id).select(fields)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves a category by its slug.
 * @param {string} slug - The category slug.
 * @param {string} fields - Fields to select.
 * @returns {Promise<Object>} The category document.
 */
const getCategoryBySlug = async (slug, fields) => {
  try {
    const category = await CategoryModel.findOne({ slug }).select(fields)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
    }
    return category
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Updates an existing category by its ID.
 * @param {string} id - The category ID.
 * @param {Object} reqBody - The updated data.
 * @returns {Promise<Object>} The updated category document.
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
 * Deletes a category by its ID and detaches it from products.
 * @param {string} id - The category ID.
 * @returns {Promise<Object>} The deleted category document.
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
