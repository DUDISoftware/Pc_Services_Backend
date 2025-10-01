"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
// src/models/Service.model.js

var schemaOptions = {
  timestamps: true,
  collection: 'services',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var serviceSchema = new _mongoose["default"].Schema({
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
    index: true,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    "enum": ['at_home', 'at_store'],
    "default": 'at_store'
  },
  estimated_time: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    "enum": ['active', 'inactive', 'hidden'],
    "default": 'active'
  },
  image: {
    type: [String],
    required: false,
    "default": []
  },
  category_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'service_categories',
    // liên kết với bảng service_categories
    required: true
  }
}, schemaOptions);
serviceSchema.index({
  name: 'text',
  description: 'text'
});
var ServiceModel = _mongoose["default"].model('services', serviceSchema);
var _default = exports["default"] = ServiceModel;