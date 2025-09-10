import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Rule chung để validate ObjectId trong params
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

const createCategory = async (req, res, next) => {
  const createCategoryRule = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().required()
  })

  try {
    const data = req?.body ? req.body : {}
    const validatedData = await createCategoryRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCategory = async (req, res, next) => {
  const updateCategoryRule = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}

    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateCategoryRule.validateAsync(data, { abortEarly: false })

    req.params = validatedParams
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const categoryValidation = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
}
