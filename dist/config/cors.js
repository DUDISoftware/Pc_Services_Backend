"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsOptions = void 0;
var _constants = require("../utils/constants");
var _environment = require("./environment");
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var corsOptions = exports.corsOptions = {
  origin: function origin(_origin, callback) {
    if (!_origin && _environment.env.BUILD_MODE === 'dev') {
      return callback(null, true);
    }
    if (_constants.WHITELIST_DOMAINS.includes(_origin)) {
      return callback(null, true);
    }
    return callback(new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, "".concat(_origin, " not allowed by our CORS Policy.")));
  },
  optionsSuccessStatus: 200,
  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
};