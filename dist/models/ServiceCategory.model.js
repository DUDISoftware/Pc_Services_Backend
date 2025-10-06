"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'service_categories',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var serviceCategorySchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    index: true,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    unique: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    "enum": ['active', 'inactive'],
    "default": 'active'
  }
}, schemaOptions);
serviceCategorySchema.index({
  name: 'text',
  description: 'text'
});
var ServiceCategoryModel = _mongoose["default"].model('service_categories', serviceCategorySchema);
var _default = exports["default"] = ServiceCategoryModel;