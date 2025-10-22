import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

const createDiscountRule = Joi.object({
  product_id: Joi.string().allow(null).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  service_id: Joi.string().allow(null).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  product_category_id: Joi.string().allow(null).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  service_category_id: Joi.string().allow(null).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  type: Joi.string().valid('product', 'service', 'product_category', 'service_category').required(),
  sale_off: Joi.number().min(0).max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required()
})

const updateDiscountRule = Joi.object({
  product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional().allow(null),
  service_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional().allow(null),
  product_category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional().allow(null),
  service_category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional().allow(null),
  type: Joi.string().valid('product', 'service', 'product_category', 'service_category').optional(),
  sale_off: Joi.number().min(0).max(100).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().greater(Joi.ref('start_date')).optional()
})

const getDiscountRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  type: Joi.string().valid('product', 'service', 'product_category', 'service_category').optional()
})

const createDiscount = async (req, res, next) => {
  try {
    const data = req.body || {}
    const validateData = await createDiscountRule.validateAsync(data, { abortEarly: false })
    req.body = validateData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateDiscount = async (req, res, next) => {
  try {
    const { id, type } = req.params || {}
    const params = { id, type }
    const data = req.body
    req.params = await getDiscountRule.validateAsync(params, { abortEarly: false })
    req.body = await updateDiscountRule.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteDiscount = async (req, res, next) => {
  try {
    const { id, type } = req.params || {}
    const params = { id, type }
    req.params = await getDiscountRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getDiscountById = async (req, res, next) => {
  try {
    const { id, type } = req.params || {}
    const params = { id, type }
    req.params = await getDiscountRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getAllDiscount = async (req, res, next) => {
  try {
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const discountValidation = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscount,
  getDiscountById
}