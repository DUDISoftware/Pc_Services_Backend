import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Joi schema validate param :id theo định dạng ObjectId hợp lệ.
 *
 * ✅ Validate:
 * - `id`: Chuỗi 24 ký tự hex theo chuẩn ObjectId.
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'string.pattern.base': OBJECT_ID_RULE_MESSAGE
  })
})

/**
 * Joi schema validate thông tin đăng nhập người dùng.
 *
 * ✅ Validate:
 * - `username`: bắt buộc, chuỗi.
 * - `password`: bắt buộc, chuỗi tối thiểu 6 ký tự.
 */
const loginValidationRule = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
})

/**
 * Joi schema validate dữ liệu khi đăng ký người dùng mới.
 *
 * ✅ Validate:
 * - `username`: bắt buộc.
 * - `password`: bắt buộc, tối thiểu 6 ký tự.
 * - `role`: 'admin' | 'staff' (tùy chọn, mặc định 'staff').
 */
const registerValidationRule = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'staff').optional()
})

/**
 * Joi schema validate khi cập nhật thông tin người dùng.
 *
 * ✅ Validate:
 * - `username`, `password`, `role`, `status` đều tùy chọn.
 * - `password` nếu có phải >= 6 ký tự.
 * - `status`: 'active' hoặc 'locked'.
 */
const updateUserValidationRule = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('admin', 'staff').optional(),
  status: Joi.string().valid('active', 'locked').optional()
})

/**
 * Joi schema validate dữ liệu khi gửi email thủ công.
 *
 * ✅ Validate:
 * - `email`: địa chỉ hợp lệ, bắt buộc.
 * - `subject`, `text`: chuỗi bắt buộc.
 */
const sendEmailValidationRule = Joi.object({
  email: Joi.string().email().required(),
  subject: Joi.string().required(),
  text: Joi.string().required()
})

/**
 * Joi schema validate body khi gửi yêu cầu OTP qua email.
 *
 * ✅ Validate:
 * - `email`: địa chỉ hợp lệ, bắt buộc.
 */
const sendOTPValidationRule = Joi.object({
  email: Joi.string().email().required()
})

/**
 * Joi schema validate body khi xác thực email bằng OTP.
 *
 * ✅ Validate:
 * - `email`: địa chỉ hợp lệ, bắt buộc.
 * - `otp`: chuỗi gồm đúng 6 ký tự, bắt buộc.
 */
const verifyEmailValidationRule = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
})

/**
 * Middleware validate body khi người dùng đăng nhập.
 *
 * Nếu hợp lệ: gán `req.body = validatedData`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req Express Request
 * @param {import('express').Response} res Express Response
 * @param {import('express').NextFunction} next Express Next Function
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
const login = async (req, res, next) => {
  try {
    const validatedData = await loginValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate body khi người dùng đăng ký mới.
 *
 * Nếu hợp lệ: gán `req.body = validatedData`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
const register = async (req, res, next) => {
  try {
    const validatedData = await registerValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id và body khi cập nhật người dùng.
 *
 * ✅ Validate:
 * - Param `id`: ObjectId hợp lệ.
 * - Body: có thể chứa các trường `username`, `password`, `role`, `status`.
 *
 * Nếu hợp lệ: gán lại `req.params`, `req.body`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu dữ liệu không hợp lệ
 */
const updateUser = async (req, res, next) => {
  try {
    const validatedId = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    const validatedData = await updateUserValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.params = validatedId
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate param :id khi xóa người dùng.
 *
 * ✅ Validate:
 * - `id`: ObjectId hợp lệ.
 *
 * Nếu hợp lệ: gán lại `req.params`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} Nếu :id không hợp lệ
 */
const deleteUser = async (req, res, next) => {
  try {
    const validatedId = await idValidationRule.validateAsync(req.params || {}, { abortEarly: false })
    req.params = validatedId
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate body khi gửi email thủ công.
 *
 * ✅ Validate:
 * - `email`, `subject`, `text` là bắt buộc.
 *
 * Nếu hợp lệ: gán lại `req.body`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sendEmail = async (req, res, next) => {
  try {
    const validatedData = await sendEmailValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate body khi gửi yêu cầu OTP qua email.
 *
 * ✅ Validate:
 * - `email` hợp lệ.
 *
 * Nếu hợp lệ: gán lại `req.body`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sendOTP = async (req, res, next) => {
  try {
    const validatedData = await sendOTPValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Middleware validate body khi xác thực email bằng mã OTP.
 *
 * ✅ Validate:
 * - `email`: bắt buộc, định dạng hợp lệ.
 * - `otp`: chuỗi 6 ký tự.
 *
 * Nếu hợp lệ: gán lại `req.body`.
 * Nếu không hợp lệ: ném `ApiError(422, message)`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyEmail = async (req, res, next) => {
  try {
    const validatedData = await verifyEmailValidationRule.validateAsync(req.body || {}, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Bộ middleware validate cho module User.
 *
 * Bao gồm:
 * - `login`: validate dữ liệu đăng nhập.
 * - `register`: validate dữ liệu đăng ký.
 * - `updateUser`: validate param và body khi cập nhật.
 * - `deleteUser`: validate param khi xóa người dùng.
 * - `sendEmail`: validate dữ liệu khi gửi email.
 * - `sendOTP`: validate dữ liệu khi gửi OTP.
 * - `verifyEmail`: validate dữ liệu khi xác thực OTP.
 */
export const userValidation = {
  login,
  register,
  updateUser,
  deleteUser,
  sendEmail,
  sendOTP,
  verifyEmail
}
