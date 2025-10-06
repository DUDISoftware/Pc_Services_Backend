"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'categories',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var categorySchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    index: true,
    required: true,
    trim: true,
    maxlength: 100
  },
  tags: {
    type: [String],
    "default": [],
    index: true,
    trim: true,
    maxlength: 200,
    required: false
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
    required: true,
    trim: true
  }
}, schemaOptions);
categorySchema.index({
  name: 'text',
  tags: 'text',
  slug: 'text'
});
var CategoryModel = _mongoose["default"].model('categories', categorySchema);
var _default = exports["default"] = CategoryModel;