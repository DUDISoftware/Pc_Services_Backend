import { StatusCodes } from 'http-status-codes'
import { ratingService } from '~/services/rating.service.js'

const createRating = async (req, res, next) => {
  try {
    const rating = await ratingService.createRating(req.body)
    res.status(StatusCodes.CREATED).json(rating)
  } catch (error) {
    next(error)
  }
}

// GET ratings by product with fields and filter as JSON
const getRatingByProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields, filter } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const filterObj = filter ? JSON.parse(filter) : undefined
    const ratings = await ratingService.getRatingsByProductId(id, filterObj, selectFields)
    res.status(StatusCodes.OK).json(ratings)
  } catch (error) {
    next(error)
  }
}

// GET ratings by service with fields and filter as JSON
const getRatingByService = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fields, filter } = req.query
    const selectFields = fields ? fields.split(',') : undefined
    const filterObj = filter ? JSON.parse(filter) : undefined
    const ratings = await ratingService.getRatingsByServiceId(id, filterObj, selectFields)
    res.status(StatusCodes.OK).json(ratings)
  } catch (error) {
    next(error)
  }
}

const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params
    await ratingService.deleteRating(id)
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Xoá đánh giá thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const ratingController = {
  createRating,
  getRatingByProduct,
  getRatingByService,
  deleteRating
}
