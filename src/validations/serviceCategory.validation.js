import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js'

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

const updateCategory = Joi.object({
  name: Joi.string().max(200).messages({
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục tối đa 200 ký tự'
  }),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('active', 'inactive')
})

const getCategoryBySlug = Joi.object({
  slug: Joi.string().required().messages({
    'any.required': 'Slug là bắt buộc',
    'string.empty': 'Slug không được để trống'
  })
})

const idValidationRule = Joi.object({
  id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
})

export const serviceCategoryValidation = {
  createCategory,
  updateCategory,
  getCategoryBySlug,
  idValidationRule
}
