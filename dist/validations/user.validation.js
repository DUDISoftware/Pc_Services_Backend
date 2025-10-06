"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _validators = require("../utils/validators");
var login = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var loginValidationRule, data, validatedData, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          loginValidationRule = _joi["default"].object({
            username: _joi["default"].string().required(),
            password: _joi["default"].string().min(6).required()
          });
          _context.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context.next = 2;
          return loginValidationRule.validateAsync(data, {
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
  return function login(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var register = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var registerValidationRule, data, validatedData, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          registerValidationRule = _joi["default"].object({
            username: _joi["default"].string().required(),
            password: _joi["default"].string().min(6).required()
          });
          _context2.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context2.next = 2;
          return registerValidationRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context2.sent;
          req.body = validatedData;
          next();
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t2 = _context2["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t2.message));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return function register(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var updateUserValidationRule, idValidationRule, data, params, validatedId, validatedData, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          updateUserValidationRule = _joi["default"].object({
            username: _joi["default"].string().optional(),
            password: _joi["default"].string().min(6).optional(),
            role: _joi["default"].string().valid('admin', 'staff').optional(),
            status: _joi["default"].string().valid('active', 'locked').optional()
          });
          idValidationRule = _joi["default"].object({
            id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
              'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE
            })
          });
          _context3.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context3.next = 2;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 2:
          validatedId = _context3.sent;
          _context3.next = 3;
          return updateUserValidationRule.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validatedData = _context3.sent;
          req.params = validatedId;
          req.body = validatedData;
          next();
          _context3.next = 5;
          break;
        case 4:
          _context3.prev = 4;
          _t3 = _context3["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t3.message));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 4]]);
  }));
  return function updateUser(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var idValidationRule, params, validatedId, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          idValidationRule = _joi["default"].object({
            id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).required().messages({
              'string.pattern.base': _validators.OBJECT_ID_RULE_MESSAGE
            })
          });
          _context4.prev = 1;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context4.next = 2;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 2:
          validatedId = _context4.sent;
          req.params = validatedId;
          next();
          _context4.next = 4;
          break;
        case 3:
          _context4.prev = 3;
          _t4 = _context4["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t4.message));
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 3]]);
  }));
  return function deleteUser(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var sendEmail = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var sendEmailValidationRule, data, validatedData, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          sendEmailValidationRule = _joi["default"].object({
            email: _joi["default"].string().email().required(),
            subject: _joi["default"].string().required(),
            text: _joi["default"].string().required()
          });
          _context5.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context5.next = 2;
          return sendEmailValidationRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context5.sent;
          req.body = validatedData;
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
  return function sendEmail(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var sendOTP = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var sendOTPValidationRule, data, validatedData, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          sendOTPValidationRule = _joi["default"].object({
            email: _joi["default"].string().email().required()
          });
          _context6.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context6.next = 2;
          return sendOTPValidationRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context6.sent;
          req.body = validatedData;
          next();
          _context6.next = 4;
          break;
        case 3:
          _context6.prev = 3;
          _t6 = _context6["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t6.message));
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 3]]);
  }));
  return function sendOTP(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var verifyEmail = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var verifyEmailValidationRule, data, validatedData, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          verifyEmailValidationRule = _joi["default"].object({
            email: _joi["default"].string().email().required(),
            otp: _joi["default"].string().length(6).required()
          });
          _context7.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context7.next = 2;
          return verifyEmailValidationRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context7.sent;
          req.body = validatedData;
          next();
          _context7.next = 4;
          break;
        case 3:
          _context7.prev = 3;
          _t7 = _context7["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t7.message));
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 3]]);
  }));
  return function verifyEmail(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var userValidation = exports.userValidation = {
  login: login,
  register: register,
  updateUser: updateUser,
  sendEmail: sendEmail,
  sendOTP: sendOTP,
  verifyEmail: verifyEmail,
  deleteUser: deleteUser
};