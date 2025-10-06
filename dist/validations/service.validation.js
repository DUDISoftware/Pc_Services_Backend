"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _validators = require("../utils/validators");
/**
 * Rule validate ObjectId
 */
var idValidationRule = _joi["default"].object({
  id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE)
});

// src/validations/service.validation.js
var createService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var schema, validated, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          schema = _joi["default"].object({
            name: _joi["default"].string().max(100).required(),
            description: _joi["default"].string().max(2000).required(),
            price: _joi["default"].number().positive().required(),
            type: _joi["default"].string().valid('at_home', 'at_store')["default"]('at_store'),
            estimated_time: _joi["default"].string().max(50).required(),
            status: _joi["default"].string().valid('active', 'inactive', 'hidden')["default"]('active'),
            category_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required(),
            // ✅ bắt buộc có category
            slug: _joi["default"].string().max(100).required()
          });
          _context.prev = 1;
          _context.next = 2;
          return schema.validateAsync(req.body || {}, {
            abortEarly: false
          });
        case 2:
          validated = _context.sent;
          req.body = validated;
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
  return function createService(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var schema, validatedParams, validatedBody, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          schema = _joi["default"].object({
            name: _joi["default"].string().max(100).required(),
            description: _joi["default"].string().max(2000).required(),
            price: _joi["default"].number().positive().required(),
            type: _joi["default"].string().valid('at_home', 'at_store')["default"]('at_store'),
            estimated_time: _joi["default"].string().max(50).required(),
            status: _joi["default"].string().valid('active', 'inactive', 'hidden')["default"]('active'),
            category_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required(),
            // ✅ bắt buộc có category
            slug: _joi["default"].string().max(100).required()
          });
          _context2.prev = 1;
          _context2.next = 2;
          return idValidationRule.validateAsync(req.params || {}, {
            abortEarly: false
          });
        case 2:
          validatedParams = _context2.sent;
          _context2.next = 3;
          return schema.validateAsync(req.body || {}, {
            abortEarly: false
          });
        case 3:
          validatedBody = _context2.sent;
          req.params = validatedParams;
          req.body = validatedBody;
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
  return function updateService(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * HIDE service (chỉ cần id)
 */
var hideService = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var validatedParams, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 1;
          return idValidationRule.validateAsync(req.params || {}, {
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
  return function hideService(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * GET service by id
 */
var getServiceById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var validatedParams, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 1;
          return idValidationRule.validateAsync(req.params || {}, {
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
  return function getServiceById(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var getServiceBySlug = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var slugValidationRule, validatedParams, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          slugValidationRule = _joi["default"].object({
            slug: _joi["default"].string().max(100).required()
          });
          _context5.prev = 1;
          _context5.next = 2;
          return slugValidationRule.validateAsync(req.params || {}, {
            abortEarly: false
          });
        case 2:
          validatedParams = _context5.sent;
          req.params = validatedParams;
          next();
          _context5.next = 4;
          break;
        case 3:
          _context5.prev = 3;
          _t5 = _context5["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t5.message));
        case 4:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 3]]);
  }));
  return function getServiceBySlug(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * DELETE service
 */
var deleteService = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var validatedParams, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 1;
          return idValidationRule.validateAsync(req.params || {}, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context6.sent;
          req.params = validatedParams;
          next();
          _context6.next = 3;
          break;
        case 2:
          _context6.prev = 2;
          _t6 = _context6["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t6.message));
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function deleteService(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var serviceValidation = exports.serviceValidation = {
  createService: createService,
  updateService: updateService,
  hideService: hideService,
  getServiceById: getServiceById,
  getServiceBySlug: getServiceBySlug,
  deleteService: deleteService
};