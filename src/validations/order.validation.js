import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const productValidationRule = Joi.object({
  product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().required().min(1)
})

const createOrder = async (req, res, next) => {
  const createOrderRule = Joi.object({
    items: Joi.array().items(productValidationRule).min(1).required(),
    name: Joi.string().required().max(200).trim(),
    phone: Joi.string().required().max(15).trim(),
    email: Joi.string().optional().allow('').max(100).trim(),
    address: Joi.string().required().max(200).trim(),
    note: Joi.string().optional().allow('').max(500).trim(),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').default('new'),
    hidden: Joi.boolean().default(false)
  })
  try {
    const data = req?.body ? req.body : {}
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
    name: Joi.string().optional().max(200).trim(),
    phone: Joi.string().optional().max(15).trim(),
    email: Joi.string().optional().allow('').max(100).trim(),
    address: Joi.string().optional().max(200).trim(),
    note: Joi.string().optional().allow('').max(500).trim(),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').default('new'),
    hidden: Joi.boolean().default(false)
  })
  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateOrderRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const hideOrder = async (req, res, next) => {
  const hideOrderRule = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
  })
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await hideOrderRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getOrderById = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getOrdersByStatus = async (req, res, next) => {
  const statusValidationRule = Joi.object({
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').required()
  })
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await statusValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
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