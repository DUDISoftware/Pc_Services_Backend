import Joi, { date } from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

const createStats = async (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date().min(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).optional()
  });
  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
  }
};

const getMonth = async (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required()
  });
  try {
    await schema.validateAsync(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
  }
};

const updateStats = async (req, res, next) => {
  const schema = Joi.object({
    total_profit: Joi.number().precision(2).min(0).optional(),
    total_repairs: Joi.number().integer().min(0).optional(),
    total_orders: Joi.number().integer().min(0).optional(),
    total_products: Joi.number().integer().min(0).optional(),
  });
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.details.map(e => e.message).join(', ')));
  }
};

const countVisit = (req, res, next) => {
  if (!req.visits) {
    req.visits = 0;
  }
  req.visits++;
  next();
};

export const statsValidation = {
  updateStats,
  createStats,
  countVisit,
  getMonth
};