"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'order_requests',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var orderRequestSchema = new _mongoose["default"].Schema({
  items: [{
    product_id: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  phone: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    maxlength: 100
  },
  note: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  status: {
    type: String,
    "enum": ['new', 'in_progress', 'completed', 'cancelled'],
    "default": 'new',
    required: false
  },
  hidden: {
    type: Boolean,
    "default": false,
    required: false
  }
}, schemaOptions);
orderRequestSchema.index({
  name: 'text',
  phone: 'text',
  email: 'text',
  status: 'text'
});
var OrderRequestModel = _mongoose["default"].model('order_requests', orderRequestSchema);
var _default = exports["default"] = OrderRequestModel;