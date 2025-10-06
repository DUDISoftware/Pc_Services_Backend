"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisClient = exports.CONNECT_REDIS = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _environment = require("./environment.js");
var _redis = require("redis");
var redisClient = exports.redisClient = (0, _redis.createClient)({
  url: 'redis://' + _environment.env.REDIS_USERNAME + ':' + _environment.env.REDIS_PASSWORD + '@' + _environment.env.REDIS_URL
});
var CONNECT_REDIS = exports.CONNECT_REDIS = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          redisClient.on('error', function (err) {
            return console.log('Redis Client Error', err);
          });
          _context.next = 1;
          return redisClient.connect();
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function CONNECT_REDIS() {
    return _ref.apply(this, arguments);
  };
}();