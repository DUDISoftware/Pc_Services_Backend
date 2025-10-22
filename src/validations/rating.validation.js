import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Joi schema để validate param :id theo định dạng ObjectId hợp lệ.
 * Dùng chung cho các API có param id.
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

/**
 * Joi schema validate dữ liệu tạo mới rating.
 * - Bắt buộc có ít nhất một trong hai: `product_id` hoặc `service_id`.
 * - `name` (string, bắt buộc, max 100)
 * - `score` (number, 1–5)
 * - `comment` (tùy chọn, max 1000)
 */
const createRatingRule = Joi.object({
  product_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  service_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),
  name: Joi.string().max(100).trim().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).trim().optional().allow('')
}).or('product_id', 'service_id')

/**
 * Middleware validate body khi tạo mới rating.
 *
 * ✅ Validate:
 * - Ít nhất một trong hai ID (`product_id` | `service_id`)
 * - `name`, `score`, `comment` (nếu có)
 *
 * Nếu hợp lệ: gán dữ liệu đã validate vào `req.body`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
const createRating = async (req, res, next) => {
  try {
    const validatedData = await createRatingRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id cho các route GET/DELETE rating theo ID sản phẩm/dịch vụ.
 *
 * ✅ Validate:
 * - `id` phải là ObjectId hợp lệ
 *
 * Nếu hợp lệ: gán lại `req.params` với dữ liệu đã validate.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu param không hợp lệ
 */
const validateIdParam = async (req, res, next) => {
  try {
    const validatedParams = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Bộ middleware validate cho module Rating.
 *
 * Bao gồm:
 * - `createRating`: validate dữ liệu tạo mới rating
 * - `getRatingByProduct`: validate param :id cho API lấy rating theo product_id
 * - `getRatingByService`: validate param :id cho API lấy rating theo service_id
 * - `deleteRating`: validate param :id khi xóa rating
 */
export const ratingValidation = {
  createRating,
  getRatingByProduct: validateIdParam,
  getRatingByService: validateIdParam,
  deleteRating: validateIdParam
}
