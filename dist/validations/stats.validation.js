"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireWildcard(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t4 in e) "default" !== _t4 && {}.hasOwnProperty.call(e, _t4) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t4)) && (i.get || i.set) ? o(f, _t4, i) : f[_t4] = e[_t4]); return f; })(e, t); }
var createStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var schema, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          schema = _joi["default"].object({
            date: _joi["default"].date().min(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).optional()
          });
          _context.prev = 1;
          _context.next = 2;
          return schema.validateAsync(req.params, {
            abortEarly: false
          });
        case 2:
          next();
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, _t.details.map(function (e) {
            return e.message;
          }).join(', ')));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function createStats(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getMonth = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var schema, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          schema = _joi["default"].object({
            month: _joi["default"].number().integer().min(1).max(12).required(),
            year: _joi["default"].number().integer().min(2000).max(2100).required()
          });
          _context2.prev = 1;
          _context2.next = 2;
          return schema.validateAsync(req.params, {
            abortEarly: false
          });
        case 2:
          next();
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t2 = _context2["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, _t2.details.map(function (e) {
            return e.message;
          }).join(', ')));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return function getMonth(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateStats = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var schema, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          schema = _joi["default"].object({
            total_profit: _joi["default"].number().precision(2).min(0).optional(),
            total_repairs: _joi["default"].number().integer().min(0).optional(),
            total_orders: _joi["default"].number().integer().min(0).optional(),
            total_products: _joi["default"].number().integer().min(0).optional()
          });
          _context3.prev = 1;
          _context3.next = 2;
          return schema.validateAsync(req.body, {
            abortEarly: false
          });
        case 2:
          next();
          _context3.next = 4;
          break;
        case 3:
          _context3.prev = 3;
          _t3 = _context3["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, _t3.details.map(function (e) {
            return e.message;
          }).join(', ')));
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 3]]);
  }));
  return function updateStats(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var countVisit = function countVisit(req, res, next) {
  if (!req.visits) {
    req.visits = 0;
  }
  req.visits++;
  next();
};
var statsValidation = exports.statsValidation = {
  updateStats: updateStats,
  createStats: createStats,
  countVisit: countVisit,
  getMonth: getMonth
};