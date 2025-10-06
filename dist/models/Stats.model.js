"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
var schemaOptions = {
  timestamps: true,
  collection: 'stats',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var statsSchema = new _mongoose["default"].Schema({
  visits: Number,
  total_profit: Number,
  total_orders: Number,
  total_repairs: Number,
  total_products: Number
}, schemaOptions);
var StatsModel = _mongoose["default"].model('Stats', statsSchema);
var _default = exports["default"] = StatsModel;