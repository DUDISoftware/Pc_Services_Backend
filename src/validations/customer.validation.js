import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Common ObjectId validation rule for params
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})
// Validation rules
const createCustomerRule = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/).message('Must enter a vietnamese phone number!').optional()
})

const updateCustomerRule = Joi.object({
  name: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().pattern(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/).message('Must enter a vietnamese phone number!').optional()
})

// Middleware functions
const createCustomer = async (req, res, next) => {
  try {
    const data = req.body || {}
    const validatedData = await createCustomerRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateCustomer = async (req, res, next) => {
  try {
    const params = req.params || {}
    const data = req.body || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.body = await updateCustomerRule.validateAsync(data, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteCustomer = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  }
  catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}
const getCustomerById = async (req, res, next) => {
  try {
    const params = req.params || {}
    req.params = await idValidationRule.validateAsync(params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const customerValidation = {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById
}