"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _UserModel = _interopRequireDefault(require("../models/User.model.js"));
var _jwt = require("../utils/jwt.js");
var _redis = require("../config/redis.js");
var _sendMail = _interopRequireDefault(require("../utils/sendMail.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var generateAndSaveTokens = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(user_id, user_role) {
    var _jwtGenerate, accessToken;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _jwtGenerate = (0, _jwt.jwtGenerate)({
            id: user_id,
            role: user_role
          }), accessToken = _jwtGenerate.accessToken;
          return _context.abrupt("return", accessToken);
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function generateAndSaveTokens(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var login = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(reqBody) {
    var username, password, user, isMatch, accessToken, returnedUser;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          username = reqBody.username, password = reqBody.password;
          _context2.next = 1;
          return _UserModel["default"].findOne({
            username: username
          }).select('_id username password role');
        case 1:
          user = _context2.sent;
          if (user) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng');
        case 2:
          _context2.next = 3;
          return user.comparePassword(password);
        case 3:
          isMatch = _context2.sent;
          if (isMatch) {
            _context2.next = 4;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng');
        case 4:
          _context2.next = 5;
          return generateAndSaveTokens(user._id, user.role);
        case 5:
          accessToken = _context2.sent;
          returnedUser = user.toObject();
          delete returnedUser.password; // Remove password from the returned user object
          return _context2.abrupt("return", {
            user: returnedUser,
            accessToken: accessToken
          });
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function login(_x3) {
    return _ref2.apply(this, arguments);
  };
}();
var register = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(reqBody) {
    var existingUser, user, returnedUser;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _UserModel["default"].findOne({
            username: reqBody.username
          });
        case 1:
          existingUser = _context3.sent;
          if (!existingUser) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại');
        case 2:
          user = new _UserModel["default"](reqBody);
          _context3.next = 3;
          return user.save();
        case 3:
          returnedUser = user.toObject();
          delete returnedUser.password; // Remove password from the returned user object
          return _context3.abrupt("return", returnedUser);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function register(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var getProfile = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(userId) {
    var user;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _UserModel["default"].findById(userId).select('-password');
        case 1:
          user = _context4.sent;
          if (user) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Người dùng không tồn tại');
        case 2:
          return _context4.abrupt("return", user);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getProfile(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getAllUsers = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var users;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 1;
          return _UserModel["default"].find().select('-password');
        case 1:
          users = _context5.sent;
          return _context5.abrupt("return", users);
        case 2:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getAllUsers() {
    return _ref5.apply(this, arguments);
  };
}();
var updateUser = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(userId, reqBody) {
    var updateData, user, userWithSameUsername;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updated_at: Date.now()
          });
          _context6.next = 1;
          return _UserModel["default"].findById(userId);
        case 1:
          user = _context6.sent;
          if (user) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Người dùng không tồn tại');
        case 2:
          if (!(user.role === 'admin')) {
            _context6.next = 3;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Không thể cập nhật thông tin của người dùng quản trị viên');
        case 3:
          _context6.next = 4;
          return _UserModel["default"].findOne({
            username: reqBody.username,
            _id: {
              $ne: userId
            }
          });
        case 4:
          userWithSameUsername = _context6.sent;
          if (!userWithSameUsername) {
            _context6.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Tên đăng nhập đã tồn tại');
        case 5:
          user.set(updateData);
          _context6.next = 6;
          return user.save();
        case 6:
          return _context6.abrupt("return", user);
        case 7:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function updateUser(_x6, _x7) {
    return _ref6.apply(this, arguments);
  };
}();
var deleteUser = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(userId) {
    var user;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 1;
          return _UserModel["default"].findById(userId);
        case 1:
          user = _context7.sent;
          if (user) {
            _context7.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Người dùng không tồn tại');
        case 2:
          if (!(user.role === 'admin')) {
            _context7.next = 3;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.FORBIDDEN, 'Không thể xóa người dùng quản trị viên');
        case 3:
          _context7.next = 4;
          return user.deleteOne();
        case 4:
          return _context7.abrupt("return", user);
        case 5:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function deleteUser(_x8) {
    return _ref7.apply(this, arguments);
  };
}();
var sendOTP = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(email) {
    var generateOTP, otp;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          generateOTP = function generateOTP() {
            return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
          };
          otp = generateOTP();
          _context8.next = 1;
          return _redis.redisClient.set(email, otp, 'EX', 300);
        case 1:
          _context8.next = 2;
          return (0, _sendMail["default"])(email, 'Mã xác thực của bạn', "M\xE3 OTP l\xE0: ".concat(otp));
        case 2:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function sendOTP(_x9) {
    return _ref8.apply(this, arguments);
  };
}();
var verifyEmail = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(email, otp) {
    var storedOtp;
    return _regenerator["default"].wrap(function (_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 1;
          return _redis.redisClient.get(email);
        case 1:
          storedOtp = _context9.sent;
          if (!(!storedOtp || storedOtp !== otp)) {
            _context9.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.UNAUTHORIZED, 'OTP không hợp lệ hoặc đã hết hạn');
        case 2:
          _context9.next = 3;
          return _redis.redisClient.del(email);
        case 3:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function verifyEmail(_x0, _x1) {
    return _ref9.apply(this, arguments);
  };
}();
var userService = exports.userService = {
  login: login,
  register: register,
  sendOTP: sendOTP,
  verifyEmail: verifyEmail,
  getProfile: getProfile,
  getAllUsers: getAllUsers,
  updateUser: updateUser,
  deleteUser: deleteUser
};