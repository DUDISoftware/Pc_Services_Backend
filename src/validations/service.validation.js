import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Joi schema validate param :id theo định dạng ObjectId hợp lệ.
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

/**
 * Joi schema validate param :slug (độ dài tối đa 100 ký tự, bắt buộc).
 */
const slugValidationRule = Joi.object({
  slug: Joi.string().max(100).required()
})

/**
 * Middleware validate dữ liệu khi tạo mới một dịch vụ (Service).
 *
 * ✅ Validate các trường:
 * - `name`, `description`, `price`, `estimated_time`, `category_id`, `slug` (bắt buộc)
 * - `type`: 'at_home' | 'at_store' (mặc định: 'at_store')
 * - `status`: 'active' | 'inactive' | 'hidden' (mặc định: 'active')
 * - `images`: mảng URL hợp lệ (tùy chọn)
 *
 * Nếu hợp lệ: gán `req.body = validatedData`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
const createService = async (req, res, next) => {
  const createServiceRule = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().positive().required(),
    type: Joi.string().valid('at_home', 'at_store').default('at_store'),
    estimated_time: Joi.string().max(50).required(),
    status: Joi.string().valid('active', 'inactive', 'hidden').default('active'),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    slug: Joi.string().max(100).required(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })

  try {
    const data = req.body || {}
    const validated = await createServiceRule.validateAsync(data, { abortEarly: false })
    req.body = validated
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id và body khi cập nhật dịch vụ.
 *
 * ✅ Validate:
 * - `id`: ObjectId hợp lệ (param)
 * - Các trường còn lại đều tùy chọn, có thể cập nhật một phần
 * - `images`: mảng URL hợp lệ (nếu có)
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu hoặc param không hợp lệ
 */
const updateService = async (req, res, next) => {
  const updatedServiceRule = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().positive().optional(),
    type: Joi.string().valid('at_home', 'at_store').default('at_store').optional(),
    estimated_time: Joi.string().max(50).optional(),
    status: Joi.string().valid('active', 'inactive', 'hidden').default('active').optional(),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
    slug: Joi.string().max(100).optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })

  try {
    const params = req.params || {}
    const body = req.body || {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedBody = await updatedServiceRule.validateAsync(body, { abortEarly: false })
    req.params = validatedParams
    req.body = validatedBody
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id cho API ẩn dịch vụ (ẩn thay vì xóa).
 *
 * ✅ Validate:
 * - `id` phải là ObjectId hợp lệ
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu param không hợp lệ
 */
const hideService = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id cho API lấy chi tiết dịch vụ theo ID.
 *
 * ✅ Validate:
 * - `id` phải là ObjectId hợp lệ
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu param không hợp lệ
 */
const getServiceById = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :slug cho API lấy dịch vụ theo slug.
 *
 * ✅ Validate:
 * - `slug`: string, max 100 ký tự, bắt buộc
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu param không hợp lệ
 */
const getServiceBySlug = async (req, res, next) => {
  try {
    const validatedParams = await slugValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id cho API xóa dịch vụ.
 *
 * ✅ Validate:
 * - `id` phải là ObjectId hợp lệ
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu param không hợp lệ
 */
const deleteService = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Bộ middleware validate cho module Service.
 *
 * Bao gồm:
 * - `createService`: validate dữ liệu tạo mới dịch vụ
 * - `updateService`: validate dữ liệu cập nhật
 * - `hideService`: validate param khi ẩn dịch vụ
 * - `getServiceById`: validate param khi lấy theo ID
 * - `getServiceBySlug`: validate param khi lấy theo slug
 * - `deleteService`: validate param khi xóa dịch vụ
 */
export const serviceValidation = {
  createService,
  updateService,
  hideService,
  getServiceById,
  getServiceBySlug,
  deleteService
}
