import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const login = async (req, res, next) => {
  const loginValidationRule = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await loginValidationRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const register = async (req, res, next) => {
  const registerValidationRule = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'staff').optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const validatedData = await registerValidationRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateUser = async (req, res, next) => {
  const updateUserValidationRule = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'staff').optional(),
    status: Joi.string().valid('active', 'locked').optional()
  })

  const idValidationRule = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    })
  })


  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedId = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateUserValidationRule.validateAsync(data, { abortEarly: false })
    req.params = validatedId
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteUser = async (req, res, next) => {
  const idValidationRule = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    })
  })
  try {
    const params = req?.params ? req.params : {}
    const validatedId = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedId
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const sendEmail = async (req, res, next) => {
  const sendEmailValidationRule = Joi.object({
    email: Joi.string().email().required(),
    subject: Joi.string().required(),
    text: Joi.string().required()
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await sendEmailValidationRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const sendOTP = async (req, res, next) => {
  const sendOTPValidationRule = Joi.object({
    email: Joi.string().email().required()
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await sendOTPValidationRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const verifyEmail = async (req, res, next) => {
  const verifyEmailValidationRule = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required()
  })
  try {
    const data = req?.body ? req.body : {}
    const validatedData = await verifyEmailValidationRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const userValidation = {
  login,
  register,
  updateUser,
  sendEmail,
  sendOTP,
  verifyEmail,
  deleteUser
}