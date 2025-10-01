"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infoService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _InfoModel = _interopRequireDefault(require("../models/Info.model.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var extractFiles = function extractFiles(filesObject) {
  var _filesObject$terms, _filesObject$policy;
  var collected = [];
  if (filesObject !== null && filesObject !== void 0 && (_filesObject$terms = filesObject.terms) !== null && _filesObject$terms !== void 0 && _filesObject$terms[0]) {
    collected.push({
      url: filesObject.terms[0].path,
      filename: filesObject.terms[0].filename
    });
  }
  if (filesObject !== null && filesObject !== void 0 && (_filesObject$policy = filesObject.policy) !== null && _filesObject$policy !== void 0 && _filesObject$policy[0]) {
    collected.push({
      url: filesObject.policy[0].path,
      filename: filesObject.policy[0].filename
    });
  }
  return collected;
};
var create = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody, filesObject) {
    var _filesObject$terms2, _filesObject$policy2;
    var termsUrl, policyUrl, info;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          termsUrl = filesObject === null || filesObject === void 0 || (_filesObject$terms2 = filesObject.terms) === null || _filesObject$terms2 === void 0 || (_filesObject$terms2 = _filesObject$terms2[0]) === null || _filesObject$terms2 === void 0 ? void 0 : _filesObject$terms2.path;
          policyUrl = filesObject === null || filesObject === void 0 || (_filesObject$policy2 = filesObject.policy) === null || _filesObject$policy2 === void 0 || (_filesObject$policy2 = _filesObject$policy2[0]) === null || _filesObject$policy2 === void 0 ? void 0 : _filesObject$policy2.path;
          info = new _InfoModel["default"](_objectSpread(_objectSpread({}, reqBody), {}, {
            terms: termsUrl,
            policy: policyUrl
          }));
          _context.next = 1;
          return info.save();
        case 1:
          return _context.abrupt("return", info);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function create(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var get = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var info;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 1;
          return _InfoModel["default"].findOne();
        case 1:
          info = _context2.sent;
          if (info) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Info not found');
        case 2:
          return _context2.abrupt("return", info);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function get() {
    return _ref2.apply(this, arguments);
  };
}();
var update = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(reqBody, filesObject) {
    var _filesObject$terms3, _filesObject$policy3;
    var updateData, info;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          });
          if (filesObject !== null && filesObject !== void 0 && (_filesObject$terms3 = filesObject.terms) !== null && _filesObject$terms3 !== void 0 && _filesObject$terms3[0]) {
            updateData.terms = filesObject.terms[0].path;
          }
          if (filesObject !== null && filesObject !== void 0 && (_filesObject$policy3 = filesObject.policy) !== null && _filesObject$policy3 !== void 0 && _filesObject$policy3[0]) {
            updateData.policy = filesObject.policy[0].path;
          }
          _context3.next = 1;
          return _InfoModel["default"].findOneAndUpdate({}, updateData, {
            "new": true
          });
        case 1:
          info = _context3.sent;
          if (info) {
            _context3.next = 3;
            break;
          }
          _context3.next = 2;
          return create(reqBody, filesObject);
        case 2:
          return _context3.abrupt("return", _context3.sent);
        case 3:
          return _context3.abrupt("return", info);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function update(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
var infoService = exports.infoService = {
  create: create,
  get: get,
  update: update
};