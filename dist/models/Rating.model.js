"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'ratings',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var ratingSchema = new _mongoose["default"].Schema({
  product_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'products',
    required: false
  },
  service_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'services',
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1000
  }
}, schemaOptions);
ratingSchema.index({
  name: 'text',
  score: 'text',
  product_id: 'text',
  service_id: 'text'
});
var RatingModel = _mongoose["default"].model('ratings', ratingSchema);
var _default = exports["default"] = RatingModel;