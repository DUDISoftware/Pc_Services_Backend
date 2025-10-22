import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Rating from '~/models/Rating.model.js'

/**
 * Creates a new rating entry in the database.
 *
 * @param {Object} reqBody - The data for the new rating.
 * @returns {Promise<Object>} The newly created rating object.
 * @throws {ApiError} Throws an error if the operation fails.
 */
const createRating = async (reqBody) => {
  try {
    const newRating = new Rating(reqBody)
    await newRating.save()
    return newRating
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves ratings for a specific product by its ID with pagination, filtering, and field selection.
 *
 * @param {string} id - The ID of the product to retrieve ratings for.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of ratings to return per page.
 * @param {Object} [filter={}] - Additional filter criteria for ratings.
 * @param {string|string[]|null} [fields=null] - Fields to select in the returned ratings.
 * @returns {Promise<{ratings: Array, total: number, page: number, limit: number}>} An object containing the ratings, total count, current page, and limit.
 * @throws {ApiError} Throws an error if the operation fails.
 */
const getRatingsByProductId = async (id, page = 1, limit = 10, filter = {}, fields = null) => {
  const skip = (page - 1) * limit
  try {
    const [ratings, total] = await Promise.all([
      Rating.find({ product_id: id, ...filter })
        .select(fields)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Rating.countDocuments({ product_id: id, ...filter })
    ])
    return {
      ratings,
      total,
      page,
      limit
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Retrieves ratings for a specific service by its ID with pagination, filtering, and field selection.
 *
 * @param {string} id - The ID of the service to retrieve ratings for.
 * @param {number} [page=1] - The page number for pagination.
 * @param {number} [limit=10] - The number of ratings to return per page.
 * @param {Object} [filter={}] - Additional filter criteria for ratings.
 * @param {string|string[]|null} [fields=null] - Fields to select in the returned ratings.
 * @returns {Promise<{ratings: Array, total: number, page: number, limit: number}>} An object containing the ratings, total count, current page, and limit.
 * @throws {ApiError} Throws an error if the operation fails.
 */
const getRatingsByServiceId = async (id, page = 1, limit = 10, filter = {}, fields = null) => {
  const skip = (page - 1) * limit
  try {
    const [ratings, total] = await Promise.all([
      Rating.find({ service_id: id, ...filter })
        .select(fields)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Rating.countDocuments({ service_id: id, ...filter })
    ])
    return {
      ratings,
      total,
      page,
      limit
    }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

/**
 * Deletes a rating by its ID.
 *
 * @param {string} id - The ID of the rating to delete.
 * @returns {Promise<Object>} The deleted rating object.
 * @throws {ApiError} Throws an error if the rating is not found or the operation fails.
 */
const deleteRating = async (id) => {
  try {
    const deleted = await Rating.findByIdAndDelete(id)
    if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, 'Rating not found')
    return deleted
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const ratingService = {
  createRating,
  getRatingsByProductId,
  getRatingsByServiceId,
  deleteRating
}
