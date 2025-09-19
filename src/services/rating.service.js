import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import Rating from '~/models/Rating.model.js'

const createRating = async (reqBody) => {
  const newRating = new Rating(reqBody)
  await newRating.save()
  return newRating
}

const getRatingsByProductId = async (productId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const ratings = await Rating.find({ product_id: productId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  return ratings
}

const getRatingsByServiceId = async (serviceId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit
  const ratings = await Rating.find({ service_id: serviceId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  return ratings
}

const deleteRating = async (id) => {
  const deleted = await Rating.findByIdAndDelete(id)
  if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, 'Rating not found')
  return deleted
}

export const ratingService = {
  createRating,
  getRatingsByProductId,
  getRatingsByServiceId,
  deleteRating
};
