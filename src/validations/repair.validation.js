import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Validation rules
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

const statusValidationRule = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').required()
})

// Middlewares
const createRepair = async (req, res, next) => {
  const createRepairRule = Joi.object({
    service_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    name: Joi.string().max(200).trim().required(),
    phone: Joi.string().max(15).trim().required(),
    email: Joi.string().max(100).trim().optional(),
    address: Joi.string().max(200).trim().required(),
    repair_type: Joi.string().valid('at_home', 'at_store').max(100).trim().required(),
    problem_description: Joi.string().max(500).trim().required(),
    estimated_time: Joi.string().max(100).trim().optional(),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').default('new'),
    hidden: Joi.boolean().default(false),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required()
      })
    ).optional()
  })
  try {
    const data = req.body || {}
    const validatedData = await createRepairRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const updateRepair = async (req, res, next) => {
  const updateRepairRule = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    service_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
    name: Joi.string().max(200).trim().optional(),
    phone: Joi.string().max(15).trim().optional(),
    email: Joi.string().max(100).trim().optional(),
    address: Joi.string().max(200).trim().optional(),
    repair_type: Joi.string().valid('at_home', 'at_store').max(100).trim().optional(),
    problem_description: Joi.string().max(500).trim().optional(),
    status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').optional(),
    hidden: Joi.boolean().optional(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required()
      })
    ).optional()
  })
  try {
    const payload = req.body || {}
    const params = req.params || {}
    const data = { ...payload, id: params.id }
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateRepairRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const hideRepair = async (req, res, next) => {
  try {
    const params = req.params || {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const deleteRepair = async (req, res, next) => {
  try {
    const params = req.params || {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getRepairById = async (req, res, next) => {
  try {
    const params = req.params || {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getRepairsByService = async (req, res, next) => {
  try {
    const params = req.params || {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

const getRepairsByStatus = async (req, res, next) => {
  try {
    const params = req.params || {}
    const validatedParams = await statusValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const repairValidation = {
  createRepair,
  updateRepair,
  hideRepair,
  deleteRepair,
  getRepairById,
  getRepairsByService,
  getRepairsByStatus
}