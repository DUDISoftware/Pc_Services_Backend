"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceCategoryValidation = void 0;
var _joi = _interopRequireDefault(require("joi"));
var _validators = require("../utils/validators.js");
var createCategory = _joi["default"].object({
  name: _joi["default"].string().max(200).required().messages({
    'any.required': 'Tên danh mục là bắt buộc',
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục tối đa 200 ký tự'
  }),
  description: _joi["default"].string().allow('', null).messages({
    'string.base': 'Mô tả phải là chuỗi'
  }),
  status: _joi["default"].string().valid('active', 'inactive')["default"]('active')
});
var updateCategory = _joi["default"].object({
  name: _joi["default"].string().max(200).messages({
    'string.empty': 'Tên danh mục không được để trống',
    'string.max': 'Tên danh mục tối đa 200 ký tự'
  }),
  description: _joi["default"].string().allow('', null),
  status: _joi["default"].string().valid('active', 'inactive')
});
var getCategoryBySlug = _joi["default"].object({
  slug: _joi["default"].string().required().messages({
    'any.required': 'Slug là bắt buộc',
    'string.empty': 'Slug không được để trống'
  })
});
var idValidationRule = _joi["default"].object({
  id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE)
});
var serviceCategoryValidation = exports.serviceCategoryValidation = {
  createCategory: createCategory,
  updateCategory: updateCategory,
  idValidationRule: idValidationRule,
  getCategoryBySlug: getCategoryBySlug
};