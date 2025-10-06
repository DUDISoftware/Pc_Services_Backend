"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.verifyAdmin = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jwt = require("../utils/jwt");
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var verifyToken = exports.verifyToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var _req$headers$authoriz;
    var token, decoded;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          token = (_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1];
          if (token) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Token không được cung cấp')));
        case 1:
          try {
            decoded = (0, _jwt.jwtVerify)(token);
            req.user = decoded;
            next();
          } catch (err) {
            next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Token không hợp lệ hoặc đã hết hạn'));
          }
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function verifyToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var verifyAdmin = exports.verifyAdmin = function verifyAdmin(req, res, next) {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return next(new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Bạn không có quyền truy cập'));
  }
  next();
};