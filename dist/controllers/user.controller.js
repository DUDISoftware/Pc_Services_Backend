"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _userService = require("../services/user.service.js");
var login = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var userData, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _userService.userService.login(req.body);
        case 1:
          userData = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Đăng nhập thành công',
            user: userData.user,
            role: userData.user.role,
            accessToken: userData.accessToken
          });
          _context.next = 3;
          break;
        case 2:
          _context.prev = 2;
          _t = _context["catch"](0);
          next(_t);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function login(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var register = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var user, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return _userService.userService.register(req.body);
        case 1:
          user = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo tài khoản thành công',
            user: user
          });
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          next(_t2);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function register(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getUserById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var userId, user, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.id;
          _context3.next = 1;
          return _userService.userService.getProfile(userId);
        case 1:
          user = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Lấy thông tin người dùng thành công',
            user: user
          });
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          next(_t3);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function getUserById(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getAllUsers = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var users, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 1;
          return _userService.userService.getAllUsers();
        case 1:
          users = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Lấy thông tin người dùng thành công',
            users: users
          });
          _context4.next = 3;
          break;
        case 2:
          _context4.prev = 2;
          _t4 = _context4["catch"](0);
          next(_t4);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function getAllUsers(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var updateUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var userId, updatedUser, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.params.id;
          _context5.next = 1;
          return _userService.userService.updateUser(userId, req.body);
        case 1:
          updatedUser = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật thông tin người dùng thành công',
            user: updatedUser
          });
          _context5.next = 3;
          break;
        case 2:
          _context5.prev = 2;
          _t5 = _context5["catch"](0);
          next(_t5);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function updateUser(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var userId, deletedUser, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.params.id;
          _context6.next = 1;
          return _userService.userService.deleteUser(userId);
        case 1:
          deletedUser = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xóa người dùng thành công',
            user: deletedUser
          });
          _context6.next = 3;
          break;
        case 2:
          _context6.prev = 2;
          _t6 = _context6["catch"](0);
          next(_t6);
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function deleteUser(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var sendEmail = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var _req$body, email, subject, text, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$body = req.body, email = _req$body.email, subject = _req$body.subject, text = _req$body.text;
          _context7.next = 1;
          return _userService.userService.sendEmail(email, subject, text);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Gửi email thành công'
          });
          _context7.next = 3;
          break;
        case 2:
          _context7.prev = 2;
          _t7 = _context7["catch"](0);
          next(_t7);
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return function sendEmail(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var sendOTP = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var email, _t8;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          email = req.body.email;
          _context8.next = 1;
          return _userService.userService.sendOTP(email);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Gửi mã OTP thành công'
          });
          _context8.next = 3;
          break;
        case 2:
          _context8.prev = 2;
          _t8 = _context8["catch"](0);
          next(_t8);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function sendOTP(_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}();
var verifyEmail = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var _req$body2, email, otp, _t9;
    return _regenerator["default"].wrap(function (_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, otp = _req$body2.otp;
          _context9.next = 1;
          return _userService.userService.verifyEmail(email, otp);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xác thực email thành công'
          });
          _context9.next = 3;
          break;
        case 2:
          _context9.prev = 2;
          _t9 = _context9["catch"](0);
          next(_t9);
        case 3:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return function verifyEmail(_x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}();
var userController = exports.userController = {
  login: login,
  register: register,
  getUserById: getUserById,
  getAllUsers: getAllUsers,
  sendEmail: sendEmail,
  sendOTP: sendOTP,
  verifyEmail: verifyEmail,
  updateUser: updateUser,
  deleteUser: deleteUser
};