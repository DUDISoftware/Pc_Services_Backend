"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'banners',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var bannerSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: Object,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    "default": 0,
    "enum": [0, 1, 2, 3, 4] // 0: no use
  },
  layout: {
    type: Number,
    "enum": [1, 2, 3],
    // 1: option1, 2: option2, 3: option3
    required: true
  },
  size: {
    type: String,
    "enum": ['large', 'small'],
    // phân biệt banner lớn/nhỏ
    "default": 'large'
  }
}, schemaOptions);
var BannerModel = _mongoose["default"].model('banners', bannerSchema);
var _default = exports["default"] = BannerModel;