import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Rule validate ObjectId
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

/**
 * CREATE service
 */
const createService = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().positive().required(),
    type: Joi.string().valid('home', 'store').default('store'),
    estimated_time: Joi.string().max(50).required(),
    status: Joi.string().valid('active', 'inactive', 'hidden').default('active')
  })

  try {
    const validated = await schema.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validated
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * UPDATE service
 */
const updateService = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().positive().optional(),
    type: Joi.string().valid('home', 'store').optional(),
    estimated_time: Joi.string().max(50).optional(),
    status: Joi.string().valid('active', 'inactive', 'hidden').optional()
  })

  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    const validatedBody = await schema.validateAsync(req.body || {}, { abortEarly: false })

    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * HIDE service (chỉ cần id)
 */
const hideService = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * GET service by id
 */
const getServiceById = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * DELETE service
 */
const deleteService = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const serviceValidation = {
  createService,
  updateService,
  hideService,
  getServiceById,
  deleteService
}
