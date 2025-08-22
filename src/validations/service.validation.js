import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

const createService = async (req, res, next) => {
  const createServiceRule = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().positive().required(),
    type: Joi.string().valid('home', 'store').optional(),
    estimated_time: Joi.string().max(50).required(),
    status: Joi.string().valid('active', 'inactive', 'hidden').optional()
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await createServiceRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateService = async (req, res, next) => {
  const updateServiceRule = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().positive().optional(),
    type: Joi.string().valid('home', 'store').optional(),
    estimated_time: Joi.string().max(50).optional(),
    status: Joi.string().valid('active', 'inactive', 'hidden').optional()
  })
  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateServiceRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const hideService = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const serviceValidation = {
  createService,
  updateService,
  hideService
}