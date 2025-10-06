import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const createRatingRule = Joi.object({
  product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  service_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  name: Joi.string().max(100).trim().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).trim().optional().allow('')
}).or('product_id', 'service_id')

const createRating = async (req, res, next) => {
  try {
    const validatedData = await createRatingRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const validateIdParam = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const ratingValidation = {
  createRating,
  getRatingByProduct: validateIdParam,
  getRatingByService: validateIdParam,
  deleteRating: validateIdParam
}
