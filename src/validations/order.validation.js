import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Validation Rules
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const productValidationRule = Joi.object({
  product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().min(1).required(),
  name: Joi.string().max(200).trim().required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().max(500).trim().optional().allow(''),
})

const statusValidationRule = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').required()
})

// Middleware Validators
const createOrder = async (req, res, next) => {
  const createOrderRule = Joi.object({
    items: Joi.array().items(productValidationRule).min(1).required(),
    name: Joi.string().max(200).trim().required(),
    phone: Joi.string().max(15).trim().required(),
    email: Joi.string().max(100).trim().optional().allow(''),
    address: Joi.string().max(200).trim().required(),
    note: Joi.string().max(500).trim().optional().allow(''),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').default('new'),
    hidden: Joi.boolean().default(false)
  })
  try {
    const data = req.body || {}
    const validatedData = await createOrderRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateOrder = async (req, res, next) => {
  const updateOrderRule = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    items: Joi.array().items(productValidationRule).min(1).optional(),
    name: Joi.string().max(200).trim().optional(),
    phone: Joi.string().max(15).trim().optional(),
    email: Joi.string().max(100).trim().optional().allow(''),
    address: Joi.string().max(200).trim().optional(),
    note: Joi.string().max(500).trim().optional().allow(''),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').default('new'),
    hidden: Joi.boolean().default(false)
  })
  try {
    const payload = req.body || {}
    const params = req.params || {}
    const data = { ...payload, ...params }
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.body = await updateOrderRule.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const hideOrder = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getOrderById = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getOrdersByStatus = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await statusValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const orderValidation = {
  createOrder,
  updateOrder,
  hideOrder,
  getOrderById,
  getOrdersByStatus
}
