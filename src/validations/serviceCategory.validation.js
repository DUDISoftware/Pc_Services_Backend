import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

/**
 * Joi schema dùng để validate dữ liệu khi **tạo mới danh mục dịch vụ (Category)**.
 *
 * ✅ Validate các trường:
 * - `name`: Chuỗi, bắt buộc, tối đa 200 ký tự.
 * - `description`: Chuỗi, tùy chọn, có thể rỗng hoặc null.
 * - `status`: 'active' hoặc 'inactive' (mặc định: 'active').
 *
 * 🧾 Thông báo lỗi (messages):
 * - "Tên danh mục là bắt buộc"
 * - "Tên danh mục tối đa 200 ký tự"
 * - "Mô tả phải là chuỗi"
 */
const createCategory = Joi.object({
  name: Joi.string().max(200).required().messages({
    'any.required': 'Tên danh mục là bắt buộc',
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục tối đa 200 ký tự'
  }),
  description: Joi.string().allow('', null).messages({
    'string.base': 'Mô tả phải là chuỗi'
  }),
  status: Joi.string().valid('active', 'inactive').default('active')
})

/**
 * Joi schema dùng để validate dữ liệu khi **cập nhật danh mục dịch vụ**.
 *
 * ✅ Validate các trường:
 * - `name`: Chuỗi, tối đa 200 ký tự (tùy chọn).
 * - `description`: Chuỗi, tùy chọn.
 * - `status`: 'active' hoặc 'inactive' (tùy chọn).
 *
 * 🧾 Thông báo lỗi (messages):
 * - "Tên danh mục không được để trống"
 * - "Tên danh mục tối đa 200 ký tự"
 */
const updateCategory = Joi.object({
  name: Joi.string().max(200).messages({
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục tối đa 200 ký tự'
  }),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('active', 'inactive')
})

/**
 * Joi schema dùng để validate param `slug` khi **lấy danh mục theo slug**.
 *
 * ✅ Validate:
 * - `slug`: Chuỗi bắt buộc, không được để trống.
 *
 * 🧾 Thông báo lỗi:
 * - "Slug là bắt buộc"
 * - "Slug không được để trống"
 */
const getCategoryBySlug = Joi.object({
  slug: Joi.string().required().messages({
    'any.required': 'Slug là bắt buộc',
    'string.empty': 'Slug không được để trống'
  })
})

/**
 * Joi schema dùng để validate param `id` theo định dạng ObjectId hợp lệ.
 *
 * ✅ Validate:
 * - `id`: Chuỗi theo chuẩn Mongo ObjectId (24 ký tự hex).
 */
const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

/**
 * Bộ schema validate cho module Category.
 *
 * Bao gồm:
 * - `createCategory`: validate khi tạo danh mục mới
 * - `updateCategory`: validate khi cập nhật danh mục
 * - `getCategoryBySlug`: validate khi lấy danh mục theo slug
 * - `idValidationRule`: validate param id theo ObjectId
 */
export const serviceCategoryValidation = {
  createCategory,
  updateCategory,
  getCategoryBySlug,
  idValidationRule
}
