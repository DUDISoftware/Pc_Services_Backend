import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const slugValidationRule = Joi.object({
  slug: Joi.string().max(200).trim().required()
})

const categoryIdValidationRule = Joi.object({
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const createProduct = async (req, res, next) => {
  const createProductRule = Joi.object({
    name: Joi.string().required().max(200).trim(),
    description: Joi.string().optional().allow('').trim(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    brand: Joi.string().required().max(100).trim(),
    status: Joi.string().valid('available', 'out_of_stock', 'hidden').default('available'),
    tags: Joi.array().items(Joi.string().max(200).trim()).optional(),
    ports: Joi.array().items(Joi.string().max(100).trim()).optional(),
    model: Joi.string().max(100).trim().optional(),
    resolution: Joi.string().max(100).trim().optional(),
    size: Joi.string().max(100).trim().optional(),
    panel: Joi.string().max(100).trim().optional(),
    slug: Joi.string().max(200).trim().required(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const validatedData = await createProductRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateProduct = async (req, res, next) => {
  const updateProductRule = Joi.object({
    name: Joi.string().optional().max(200).trim(),
    description: Joi.string().optional().allow('').trim(),
    price: Joi.number().optional().min(0),
    quantity: Joi.number().optional().min(0),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
    brand: Joi.string().optional().max(100).trim(),
    status: Joi.string().valid('available', 'out_of_stock', 'hidden').optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateProductRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// ✅ thêm validate cho GET by ID
const getProductById = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

// ✅ thêm validate cho GET by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await categoryIdValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getProductBySlug = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await slugValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const productValidation = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getProductById,
  getProductsByCategory
}
