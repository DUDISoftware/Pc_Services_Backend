import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'

/**
 * Middleware validate param `date` khi tạo mới thống kê (Stats).
 *
 * ✅ Validate:
 * - `date`: kiểu Date, phải lớn hơn hoặc bằng ngày đầu tiên của tháng hiện tại (tùy chọn).
 *
 * Nếu hợp lệ: gọi `next()`.
 * Nếu không hợp lệ: ném `ApiError(400, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
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
    next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        error.details.map(e => e.message).join(', ')
      )
    )
  }
}

/**
 * Middleware validate param `month` và `year` khi lấy thống kê theo tháng/năm.
 *
 * ✅ Validate:
 * - `month`: số nguyên 1–12 (bắt buộc)
 * - `year`: số nguyên 2000–2100 (bắt buộc)
 *
 * Nếu hợp lệ: gọi `next()`.
 * Nếu không hợp lệ: ném `ApiError(400, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu param không hợp lệ
 */
const getMonth = async (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2000).max(2100).required()
  })

  try {
    await schema.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        error.details.map(e => e.message).join(', ')
      )
    )
  }
}

/**
 * Middleware validate body khi cập nhật thống kê (Stats).
 *
 * ✅ Các trường hợp lệ (tất cả đều tùy chọn):
 * - `total_profit`: số thực ≥ 0, tối đa 2 chữ số thập phân
 * - `total_repairs`: số nguyên ≥ 0
 * - `total_orders`: số nguyên ≥ 0
 * - `total_products`: số nguyên ≥ 0
 *
 * Nếu hợp lệ: gán dữ liệu đã validate vào `req.body`.
 * Nếu không hợp lệ: ném `ApiError(400, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu body không hợp lệ
 */
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
    next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        error.details.map(e => e.message).join(', ')
      )
    )
  }
}

/**
 * Middleware đếm số lượt truy cập (visit counter).
 *
 * ✅ Cơ chế:
 * - Mỗi lần request đi qua middleware, tăng `req.visits` lên 1.
 * - Dữ liệu chỉ tồn tại trong vòng đời request (không lưu DB).
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 */
const countVisit = (req, res, next) => {
  req.visits = (req.visits || 0) + 1
  next()
}

/**
 * Bộ middleware validate cho module Stats.
 *
 * Bao gồm:
 * - `createStats`: validate param date khi tạo thống kê mới
 * - `getMonth`: validate param month/year khi lấy thống kê theo tháng
 * - `updateStats`: validate body khi cập nhật thống kê
 * - `countVisit`: middleware đếm số lượt truy cập
 */
export const statsValidation = {
  createStats,
  getMonth,
  updateStats,
  countVisit
}
