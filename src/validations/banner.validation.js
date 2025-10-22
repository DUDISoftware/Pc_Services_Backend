import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

// Common ID validation rule
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

// Update Banner Validation
/**
 * Middleware to validate and sanitize request body for creating a banner.
 * Validates banner fields such as title, description, link, position, layout, size, and image using Joi.
 * If validation fails, passes an ApiError to the next middleware.
 *
 * @async
 * @function createBanner
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const createBanner = async (req, res, next) => {
  const createBannerRule = Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(500).required(),
    link: Joi.string().required(),
    position: Joi.number().valid(0, 1, 2, 3, 4).required(),
    layout: Joi.number().valid(1, 2, 3).required(),
    size: Joi.string().valid('large', 'small').optional(),
    image: Joi.any().optional()
  })

  try {
    const data = req.body || {}
    req.body = await createBannerRule.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware to validate and sanitize request parameters and body for updating a banner.
 * Validates banner fields such as title, description, link, position, layout, and size using Joi.
 * If validation fails, passes an ApiError to the next middleware.
 *
 * @async
 * @function updateBanner
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const updateBanner = async (req, res, next) => {
  const updateBannerRule = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    link: Joi.string().optional(),
    position: Joi.number().valid(0, 1, 2, 3, 4).optional(),
    layout: Joi.number().valid(1, 2, 3).optional(),
    size: Joi.string().valid('large', 'small').optional()
  })

  try {
    req.params = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.body = await updateBannerRule.validateAsync(req.body || {}, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware to validate and sanitize request parameters for deleting a banner.
 * Validates the banner id using Joi.
 * If validation fails, passes an ApiError to the next middleware.
 *
 * @async
 * @function deleteBanner
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const deleteBanner = async (req, res, next) => {
  try {
    req.params = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
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