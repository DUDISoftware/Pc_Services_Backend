import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

const createBanner = async (req, res, next) => {
  const createBannerRule = Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(500).required(),
    link: Joi.string().required(),
    position: Joi.number().valid(0, 1, 2, 3, 4).required(), // 0: no use
    image: Joi.array().items(Joi.string().uri()).optional()
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await createBannerRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateBanner = async (req, res, next) => {
  const updateBannerRule = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    link: Joi.string().optional(),
    position: Joi.number().valid(0, 1, 2, 3, 4).optional() // 0: no use
  })
  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateBannerRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteBanner = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const bannerValidation = {
  createBanner,
  updateBanner,
  deleteBanner
}