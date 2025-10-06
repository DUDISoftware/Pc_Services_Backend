"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _ServiceModel = _interopRequireDefault(require("../models/Service.model.js"));
var _excluded = ["category"],
  _excluded2 = ["category_id"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody) {
    var category, rest, service;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          category = reqBody.category, rest = (0, _objectWithoutProperties2["default"])(reqBody, _excluded);
          service = new _ServiceModel["default"](_objectSpread(_objectSpread({}, rest), {}, {
            category: category
          }));
          _context.next = 1;
          return service.save();
        case 1:
          return _context.abrupt("return", service.populate('category_id', 'name'));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createService(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, reqBody) {
    var category_id, rest, updateData, service;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          category_id = reqBody.category_id, rest = (0, _objectWithoutProperties2["default"])(reqBody, _excluded2);
          updateData = _objectSpread(_objectSpread(_objectSpread({}, rest), category_id && {
            category_id: category_id
          }), {}, {
            updated_at: Date.now()
          });
          _context2.next = 1;
          return _ServiceModel["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          }).populate('category_id', 'name');
        case 1:
          service = _context2.sent;
          if (service) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Service not found');
        case 2:
          return _context2.abrupt("return", service);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateService(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var hideService = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var service;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _ServiceModel["default"].findById(id);
        case 1:
          service = _context3.sent;
          if (service) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Service not found');
        case 2:
          service.status = 'hidden';
          _context3.next = 3;
          return service.save();
        case 3:
          return _context3.abrupt("return", service);
        case 4:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function hideService(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

// src/services/customerService.service.js
var getAllServices = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var filter,
      _args4 = arguments;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          filter = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
          _context4.next = 1;
          return _ServiceModel["default"].find(filter).populate('category_id', 'name description status') // ✅ lấy thêm thông tin category
          .sort({
            created_at: -1
          });
        case 1:
          return _context4.abrupt("return", _context4.sent);
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getAllServices() {
    return _ref4.apply(this, arguments);
  };
}();
var getServiceById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    var service;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 1;
          return _ServiceModel["default"].findById(id).populate('category_id', 'name description status');
        case 1:
          service = _context5.sent;
          if (service) {
            _context5.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Service not found');
        case 2:
          return _context5.abrupt("return", service);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getServiceById(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var getServiceBySlug = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(slug) {
    var service;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return _ServiceModel["default"].findOne({
            slug: slug
          }).populate('category_id', 'name description status');
        case 1:
          service = _context6.sent;
          if (service) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Service not found');
        case 2:
          return _context6.abrupt("return", service);
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function getServiceBySlug(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var deleteService = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(id) {
    var service;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 1;
          return _ServiceModel["default"].findByIdAndDelete(id);
        case 1:
          service = _context7.sent;
          if (service) {
            _context7.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Service not found');
        case 2:
          return _context7.abrupt("return", service);
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function deleteService(_x7) {
    return _ref7.apply(this, arguments);
  };
}();
var serviceService = exports.serviceService = {
  createService: createService,
  updateService: updateService,
  hideService: hideService,
  getServiceBySlug: getServiceBySlug,
  getAllServices: getAllServices,
  getServiceById: getServiceById,
  deleteService: deleteService
};