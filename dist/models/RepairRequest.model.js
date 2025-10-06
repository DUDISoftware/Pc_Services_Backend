"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'repair_requests',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var repairRequestSchema = new _mongoose["default"].Schema({
  service_id: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'services',
    required: true
  },
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
    required: true,
    unique: false,
    trim: true,
    maxlength: 100
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  repair_type: {
    type: String,
    "enum": ['at_home', 'at_store'],
    required: true
  },
  problem_description: {
    type: String,
    required: true,
    maxlength: 500
  },
  estimated_time: {
    type: String,
    required: false,
    maxlength: 100
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
  },
  images: {
    type: [Object],
    "default": []
  }
}, schemaOptions);
repairRequestSchema.index({
  name: 'text',
  phone: 'text',
  email: 'text',
  status: 'text'
});
var RepairRequestModel = _mongoose["default"].model('repair_requests', repairRequestSchema);
var _default = exports["default"] = RepairRequestModel;