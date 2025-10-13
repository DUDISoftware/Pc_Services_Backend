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
 * Rule validate Slug
 */
const slugValidationRule = Joi.object({
  slug: Joi.string().max(100).required()
})

/**
 * Rule validate Service Body
 */
const serviceBodySchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(2000).required(),
  price: Joi.number().positive().required(),
  type: Joi.string().valid('at_home', 'at_store').default('at_store'),
  estimated_time: Joi.string().max(50).required(),
  status: Joi.string().valid('active', 'inactive', 'hidden').default('active'),
  category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  slug: Joi.string().max(100).required(),
  discount: Joi.number().min(0).max(100).optional(),

})

/**
 * CREATE service
 */
const createService = async (req, res, next) => {
  try {
    const validated = await serviceBodySchema.validateAsync(req.body || {}, { abortEarly: false })
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
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    const validatedBody = await serviceBodySchema.validateAsync(req.body || {}, { abortEarly: false })
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
 * GET service by slug
 */
const getServiceBySlug = async (req, res, next) => {
  try {
    const validatedParams = await slugValidationRule.validateAsync(req.params || {}, { abortEarly: false })
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
  getServiceBySlug,
  deleteService
}
