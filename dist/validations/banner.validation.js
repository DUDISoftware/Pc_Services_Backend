"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bannerValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _validators = require("../utils/validators.js");
var idValidationRule = _joi["default"].object({
  id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE)
});
var createBanner = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var createBannerRule, data, validatedData, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          createBannerRule = _joi["default"].object({
            title: _joi["default"].string().max(200).required(),
            description: _joi["default"].string().max(500).required(),
            link: _joi["default"].string().required(),
            position: _joi["default"].number().valid(0, 1, 2, 3, 4).required(),
            layout: _joi["default"].number().valid(1, 2, 3).required(),
            size: _joi["default"].string().valid('large', 'small').optional(),
            image: _joi["default"].any().optional()
          });
          _context.prev = 1;
          data = req.body || {};
          _context.next = 2;
          return createBannerRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context.sent;
          req.body = validatedData;
          next();
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t.message));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function createBanner(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateBanner = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var updateBannerRule, data, params, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          updateBannerRule = _joi["default"].object({
            title: _joi["default"].string().optional(),
            description: _joi["default"].string().optional(),
            link: _joi["default"].string().optional(),
            position: _joi["default"].number().valid(0, 1, 2, 3, 4).optional(),
            layout: _joi["default"].number().valid(1, 2, 3).optional(),
            size: _joi["default"].string().valid('large', 'small').optional()
          });
          _context2.prev = 1;
          data = req.body || {};
          params = req.params || {};
          _context2.next = 2;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 2:
          req.params = _context2.sent;
          _context2.next = 3;
          return updateBannerRule.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          req.body = _context2.sent;
          next();
          _context2.next = 5;
          break;
        case 4:
          _context2.prev = 4;
          _t2 = _context2["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t2.message));
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 4]]);
  }));
  return function updateBanner(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var deleteBanner = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var params, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          params = req.params || {};
          _context3.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          req.params = _context3.sent;
          next();
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t3.message));
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function deleteBanner(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var bannerValidation = exports.bannerValidation = {
  createBanner: createBanner,
  updateBanner: updateBanner,
  deleteBanner: deleteBanner
};