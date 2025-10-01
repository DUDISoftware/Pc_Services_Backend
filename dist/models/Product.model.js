"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'products',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var productSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  tags: {
    type: [String],
    "default": [],
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
  ports: {
    type: [String],
    "default": [],
    trim: true,
    maxLength: 50,
    required: false
  },
  panel: {
    type: String,
    "default": '',
    trim: true,
    maxLength: 100,
    required: false
  },
  resolution: {
    type: String,
    "default": '',
    trim: true,
    maxLength: 50,
    required: false
  },
  size: {
    type: String,
    "default": '',
    trim: true,
    maxLength: 50,
    required: false
  },
  model: {
    type: String,
    "default": '',
    trim: true,
    maxLength: 100,
    required: false
  },
  description: {
    type: String,
    trim: true,
    "default": ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'categories',
    required: true
  },
  brand: {
    type: String,
    required: true,
    maxlength: 100
  },
  images: {
    type: [Object],
    "default": []
  },
  status: {
    type: String,
    "enum": ['available', 'out_of_stock', 'hidden'],
    "default": 'available'
  },
  is_featured: {
    type: Boolean,
    "default": false
  }
}, schemaOptions);
productSchema.index({
  name: 'text',
  tags: 'text',
  brand: 'text'
});
var ProductModel = _mongoose["default"].model('products', productSchema);
var _default = exports["default"] = ProductModel;