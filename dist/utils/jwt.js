"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestNewToken = exports.jwtVerifyRefresh = exports.jwtVerify = exports.jwtGenerate = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _environment = require("../config/environment.js");
var _ApiError = _interopRequireDefault(require("./ApiError"));
var _httpStatusCodes = require("http-status-codes");
var jwtGenerate = exports.jwtGenerate = function jwtGenerate(payload) {
  var accessToken = _jsonwebtoken["default"].sign(payload, _environment.env.JWT_SECRET, {
    expiresIn: _environment.env.JWT_EXPIRES_IN || '24h'
  });
  // const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
  //   expiresIn: env.JWT_REFRESH_EXPIRES_IN || '30d'
  // })
  // return { accessToken, refreshToken }
  return {
    accessToken: accessToken
  };
};
var requestNewToken = exports.requestNewToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(refreshToken) {
    var decoded, newTokens, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          decoded = _jsonwebtoken["default"].verify(refreshToken, _environment.env.JWT_REFRESH_SECRET);
          newTokens = _jsonwebtoken["default"].sign({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          }, _environment.env.JWT_SECRET, {
            expiresIn: _environment.env.JWT_EXPIRES_IN || '24h'
          });
          return _context.abrupt("return", newTokens);
        case 1:
          _context.prev = 1;
          _t = _context["catch"](0);
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Refresh token đã hết hạn hoặc không hợp lệ');
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 1]]);
  }));
  return function requestNewToken(_x) {
    return _ref.apply(this, arguments);
  };
}();
var jwtVerify = exports.jwtVerify = function jwtVerify(token) {
  try {
    return _jsonwebtoken["default"].verify(token, _environment.env.JWT_SECRET);
  } catch (error) {
    throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Access Token không hợp lệ');
  }
};
var jwtVerifyRefresh = exports.jwtVerifyRefresh = function jwtVerifyRefresh(token) {
  try {
    return _jsonwebtoken["default"].verify(token, _environment.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Refresh Token không hợp lệ');
  }
};