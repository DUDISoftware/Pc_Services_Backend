import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Joi schema để validate param :id theo định dạng ObjectId hợp lệ.
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

/**
 * Joi schema validate param :status (trạng thái của yêu cầu sửa chữa).
 * Hợp lệ: `new`, `in_progress`, `completed`, `cancelled`.
 */
const statusValidationRule = Joi.object({
  status: Joi.string().valid('new', 'in_progress', 'completed', 'cancelled').required()
})

/**
 * Middleware validate body khi tạo mới yêu cầu sửa chữa (Repair Request).
 *
 * ✅ Validate các trường:
 * - `service_id` (ObjectId hợp lệ)
 * - `name`, `phone`, `address`, `repair_type`, `problem_description` (bắt buộc)
 * - `status` có giá trị mặc định là `'new'`
 * - `images` là mảng chứa các object có `url` & `public_id`
 *
 * Nếu hợp lệ: gán `req.body = validatedData`
 * Nếu không hợp lệ: ném `ApiError(422, message)`
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
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

/**
 * Middleware validate param :id và body khi cập nhật yêu cầu sửa chữa.
 *
 * ✅ Validate:
 * - `id` (ObjectId hợp lệ, bắt buộc)
 * - Các trường khác là tùy chọn, cho phép cập nhật một phần
 * - `images` có thể chứa danh sách URL và public_id mới
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu hoặc param không hợp lệ
 */
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

/**
 * Middleware validate param :id cho API ẩn yêu cầu sửa chữa (hidden = true).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :id không hợp lệ
 */
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

/**
 * Middleware validate param :id cho API xóa yêu cầu sửa chữa.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :id không hợp lệ
 */
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

/**
 * Middleware validate param :id cho API lấy thông tin chi tiết yêu cầu sửa chữa.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :id không hợp lệ
 */
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

/**
 * Middleware validate param :id cho API lấy danh sách yêu cầu sửa chữa theo service.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :id không hợp lệ
 */
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

/**
 * Middleware validate param :status cho API lấy danh sách yêu cầu sửa chữa theo trạng thái.
 *
 * ✅ Hợp lệ: `new`, `in_progress`, `completed`, `cancelled`
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :status không hợp lệ
 */
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

/**
 * Bộ middleware validate cho module Repair Request.
 *
 * Bao gồm:
 * - `createRepair`: validate dữ liệu tạo mới yêu cầu
 * - `updateRepair`: validate cập nhật
 * - `hideRepair`: validate param khi ẩn yêu cầu
 * - `deleteRepair`: validate param khi xóa
 * - `getRepairById`: validate param khi lấy chi tiết
 * - `getRepairsByService`: validate param khi lấy theo service
 * - `getRepairsByStatus`: validate param khi lấy theo trạng thái
 */
export const repairValidation = {
  createRepair,
  updateRepair,
  hideRepair,
  deleteRepair,
  getRepairById,
  getRepairsByService,
  getRepairsByStatus
}
