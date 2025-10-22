import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Common ObjectId validation rule for params
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})


/**
 * Middleware to validate request body for creating a category.
 * Validates `req.body` using `createCategoryRule`.
 * If validation passes, proceeds to the next middleware; otherwise, passes an ApiError to the error handler.
 *
 * @async
 * @function createCategory
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const createCategoryRule = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().required(),
  slug: Joi.string().max(200).required(),
  tags: Joi.array().items(Joi.string().max(50)).optional()
})

/**
 * Middleware to validate request parameters and body for updating a category.
 * Validates `req.params` using `idValidationRule` and `req.body` using `updateCategoryRule`.
 * If validation passes, proceeds to the next middleware; otherwise, passes an ApiError to the error handler.
 *
 * @async
 * @function updateCategory
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
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

/**
 * Middleware to validate request parameters for deleting a category.
 * Validates `req.params` using `idValidationRule`.
 * If validation passes, proceeds to the next middleware; otherwise, passes an ApiError to the error handler.
 *
 * @async
 * @function deleteCategory
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
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

/**
 * Middleware to validate request parameters for deleting a category.
 * Validates `req.params` using `idValidationRule`.
 * If validation passes, proceeds to the next middleware; otherwise, passes an ApiError to the error handler.
 *
 * @async
 * @function deleteCategory
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const deleteCategory = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware to validate request parameters for getting a category by ID.
 * Validates `req.params` using `idValidationRule`.
 * If validation passes, proceeds to the next middleware; otherwise, passes an ApiError to the error handler.
 *
 * @async
 * @function getCategoryById
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const getCategoryById = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware to validate request parameters for getting a category by slug.
 * No validation is performed; proceeds to the next middleware.
 *
 * @async
 * @function getCategoryBySlug
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
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
