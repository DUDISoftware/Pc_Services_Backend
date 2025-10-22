import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError.js'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

/**
 * Schema validate param :id theo ObjectId.
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

/**
 * Schema validate param :slug (tối đa 200 ký tự, trim).
 */
const slugValidationRule = Joi.object({
  slug: Joi.string().max(200).trim().required()
})

/**
 * Schema validate param :categoryId theo ObjectId.
 */
const categoryIdValidationRule = Joi.object({
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()
})

/**
 * Validate body tạo mới product.
 *
 * Trường bắt buộc: name, price, quantity, category_id, brand, slug.
 * Nếu hợp lệ sẽ gán `req.body = validatedData` và gọi `next()`.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu dữ liệu không hợp lệ
 */
const createProduct = async (req, res, next) => {
  const createProductRule = Joi.object({
    name: Joi.string().required().max(200).trim(),
    description: Joi.string().optional().allow('').trim(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    brand: Joi.string().required().max(100).trim(),
    status: Joi.string().valid('available', 'out_of_stock', 'hidden').default('available'),
    tags: Joi.array().items(Joi.string().max(200).trim()).optional(),
    ports: Joi.array().items(Joi.string().max(100).trim()).optional(),
    model: Joi.string().max(100).trim().optional(),
    resolution: Joi.string().max(100).trim().optional(),
    size: Joi.string().max(100).trim().optional(),
    panel: Joi.string().max(100).trim().optional(),
    slug: Joi.string().max(200).trim().required(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const validatedData = await createProductRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id và body cập nhật product.
 *
 * Yêu cầu giống createProduct; thêm validate :id.
 * Nếu hợp lệ sẽ gán `req.params` và `req.body` đã được chuẩn hóa.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu dữ liệu/param không hợp lệ
 */
const updateProduct = async (req, res, next) => {
  const updateProductRule = Joi.object({
    name: Joi.string().required().max(200).trim(),
    description: Joi.string().optional().allow('').trim(),
    price: Joi.number().required().min(0),
    quantity: Joi.number().required().min(0),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
    brand: Joi.string().required().max(100).trim(),
    status: Joi.string().valid('available', 'out_of_stock', 'hidden').default('available'),
    tags: Joi.array().items(Joi.string().max(200).trim()).optional(),
    ports: Joi.array().items(Joi.string().max(100).trim()).optional(),
    model: Joi.string().max(100).trim().optional(),
    resolution: Joi.string().max(100).trim().optional(),
    size: Joi.string().max(100).trim().optional(),
    panel: Joi.string().max(100).trim().optional(),
    slug: Joi.string().max(200).trim().required(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })

  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateProductRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id và body cập nhật số lượng.
 *
 * Trường bắt buộc: quantity >= 0.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu không hợp lệ
 */
const updateQuantity = async (req, res, next) => {
  const updateQuantityRule = Joi.object({
    quantity: Joi.number().required().min(0)
  })
  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateQuantityRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id và body cập nhật trạng thái sản phẩm.
 *
 * Hợp lệ một trong: 'available' | 'out_of_stock' | 'hidden'.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu không hợp lệ
 */
const updateStatus = async (req, res, next) => {
  const updateStatusRule = Joi.object({
    status: Joi.string().valid('available', 'out_of_stock', 'hidden').required()
  })
  try {
    const data = req?.body ? req.body : {}
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    const validatedData = await updateStatusRule.validateAsync(data, { abortEarly: false })
    req.body = validatedData
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id cho thao tác xóa product.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu :id không hợp lệ
 */
const deleteProduct = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id cho API GET /products/:id.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu :id không hợp lệ
 */
const getProductById = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :categoryId cho API GET /products/category/:categoryId.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu :categoryId không hợp lệ
 */
const getProductsByCategory = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await categoryIdValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :slug cho API GET /products/slug/:slug.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu :slug không hợp lệ
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await slugValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Validate param :id cho API GET số lượng tồn kho.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @throws {ApiError} 422 nếu :id không hợp lệ
 */
const getQuantity = async (req, res, next) => {
  try {
    const params = req?.params ? req.params : {}
    const validatedParams = await idValidationRule.validateAsync(params, { abortEarly: false })
    req.params = validatedParams
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

/**
 * Bộ middleware validate cho module Product.
 */
export const productValidation = {
  createProduct,
  updateProduct,
  updateStatus,
  updateQuantity,
  deleteProduct,
  getProductBySlug,
  getProductById,
  getProductsByCategory,
  getQuantity
}
