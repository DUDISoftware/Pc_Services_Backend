"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _OrderRequestModel = _interopRequireDefault(require("../models/OrderRequest.model.js"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody) {
    var newRequest;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          newRequest = new _OrderRequestModel["default"](reqBody);
          _context.next = 1;
          return newRequest.save();
        case 1:
          return _context.abrupt("return", newRequest);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createRequest(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateRequest = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, reqBody) {
    var updateData, updated;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          });
          _context2.next = 1;
          return _OrderRequestModel["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          });
        case 1:
          updated = _context2.sent;
          if (updated) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          return _context2.abrupt("return", updated);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateRequest(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var hideRequest = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var updateData, updated;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          updateData = {
            hidden: true,
            updatedAt: Date.now()
          };
          _context3.next = 1;
          return _OrderRequestModel["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          });
        case 1:
          updated = _context3.sent;
          if (updated) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          return _context3.abrupt("return", updated);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function hideRequest(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var getAllRequests = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var page,
      limit,
      skip,
      requests,
      _args4 = arguments;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          page = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 1;
          limit = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 10;
          skip = (page - 1) * limit;
          _context4.next = 1;
          return _OrderRequestModel["default"].find().populate('items.product_id', 'name price images').skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          requests = _context4.sent;
          return _context4.abrupt("return", requests);
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getAllRequests() {
    return _ref4.apply(this, arguments);
  };
}();
var getRequestById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    var request;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 1;
          return _OrderRequestModel["default"].findById(id).populate('items.product_id', 'name price images');
        case 1:
          request = _context5.sent;
          if (request) {
            _context5.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          return _context5.abrupt("return", request);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getRequestById(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var orderService = exports.orderService = {
  createRequest: createRequest,
  updateRequest: updateRequest,
  hideRequest: hideRequest,
  getRequestById: getRequestById,
  getAllRequests: getAllRequests
};