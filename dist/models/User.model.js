"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var schemaOptions = {
  timestamps: true,
  collection: 'users',
  toJSON: {
    virtuals: true,
    versionKey: false
  }
};
var userSchema = new _mongoose["default"].Schema({
  username: {
    type: String,
    index: true,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    "enum": ['admin', 'staff'],
    "default": 'staff'
  },
  status: {
    type: String,
    "enum": ['active', 'locked'],
    "default": 'active'
  }
}, schemaOptions);
userSchema.pre('save', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var salt;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!this.isModified('password')) {
            _context.next = 3;
            break;
          }
          _context.next = 1;
          return _bcryptjs["default"].genSalt(10);
        case 1:
          salt = _context.sent;
          _context.next = 2;
          return _bcryptjs["default"].hash(this.password, salt);
        case 2:
          this.password = _context.sent;
        case 3:
          next();
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
userSchema.methods.comparePassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(candidatePassword) {
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 1;
          return _bcryptjs["default"].compare(candidatePassword, this.password);
        case 1:
          return _context2.abrupt("return", _context2.sent);
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2, this);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var UserModel = _mongoose["default"].model('users', userSchema);
var _default = exports["default"] = UserModel;