import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

// Validation for creating stats
const createStats = async (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date()
      .min(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
      .optional()
  })
  try {
    await schema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')))
  }
}

// Validation for getting stats by month and year
const getMonth = async (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required()
  })
  try {
    await schema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')))
  }
}

// Validation for updating stats
const updateStats = async (req, res, next) => {
  const schema = Joi.object({
    total_profit: Joi.number().precision(2).min(0).optional(),
    total_repairs: Joi.number().integer().min(0).optional(),
    total_orders: Joi.number().integer().min(0).optional(),
    total_products: Joi.number().integer().min(0).optional()
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')))
  }
}

// Middleware for counting visits
const countVisit = (req, res, next) => {
  req.visits = (req.visits || 0) + 1
  next()
}

export const statsValidation = {
  createStats,
  getMonth,
  updateStats,
  countVisit
}