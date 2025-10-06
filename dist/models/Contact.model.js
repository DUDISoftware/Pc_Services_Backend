"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'contacts',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var contactSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: 200
  },
  map_link: {
    type: String,
    required: true,
    trim: true
  }
}, schemaOptions);
var ContactModel = _mongoose["default"].model('contacts', contactSchema);
var _default = exports["default"] = ContactModel;