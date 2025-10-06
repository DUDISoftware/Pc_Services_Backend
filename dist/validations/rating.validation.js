"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ratingValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _validators = require("../utils/validators");
var idValidationRule = _joi["default"].object({
  id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required()
});
var createRating = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var createRatingRule, data, validatedData, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          createRatingRule = _joi["default"].object({
            product_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).optional(),
            service_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).optional(),
            name: _joi["default"].string().required().max(100).trim(),
            rating: _joi["default"].number().required().min(1).max(5),
            comment: _joi["default"].string().optional().allow('').max(1000).trim()
          }).or('product_id', 'service_id');
          _context.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context.next = 2;
          return createRatingRule.validateAsync(data, {
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
  return function createRating(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getRatingByProduct = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var params, validatedParams, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context2.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context2.sent;
          req.params = validatedParams;
          next();
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t2.message));
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function getRatingByProduct(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getRatingByService = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var params, validatedParams, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context3.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context3.sent;
          req.params = validatedParams;
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
  return function getRatingByService(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteRating = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var params, validatedParams, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context4.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context4.sent;
          req.params = validatedParams;
          next();
          _context4.next = 3;
          break;
        case 2:
          _context4.prev = 2;
          _t4 = _context4["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t4.message));
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function deleteRating(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var ratingValidation = exports.ratingValidation = {
  createRating: createRating,
  getRatingByProduct: getRatingByProduct,
  getRatingByService: getRatingByService,
  deleteRating: deleteRating
};