import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Rating from '~/models/Rating.model.js'

const createRating = async (reqBody) => {
  try {
    const newRating = new Rating(reqBody)
    await newRating.save()
    return newRating
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const getRatingsByProductId = async (id, page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit
  try {
    const [ratings, total] = await Promise.all([
      Rating.find({ product_id: id, ...filter })
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

const getRatingsByServiceId = async (id, page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit
  try {
    const [ratings, total] = await Promise.all([
      Rating.find({ service_id: id, ...filter })
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
