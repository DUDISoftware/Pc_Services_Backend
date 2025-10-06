import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Common ObjectId validation rule for params
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

// Validation rules
const createCategoryRule = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().required(),
  slug: Joi.string().max(200).required(),
  tags: Joi.array().items(Joi.string().max(50)).optional()
})

const updateCategoryRule = Joi.object({
  name: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  slug: Joi.string().max(200).optional(),
  tags: Joi.array().items(Joi.string().max(50)).optional()
})

// Middleware functions
const createCategory = async (req, res, next) => {
  try {
    const data = req.body || {}
    const validatedData = await createCategoryRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const params = req.params || {}
    const data = req.body || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.body = await updateCategoryRule.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getCategoryBySlug = async (req, res, next) => {
  try {
    req.params = req.params || {}
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const categoryValidation = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug
}
