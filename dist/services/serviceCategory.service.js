"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceCategoryService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _ServiceCategoryModel = _interopRequireDefault(require("../models/ServiceCategory.model.js"));
var _Service = _interopRequireDefault(require("../models/Service.model"));
// src/services/serviceCategory.service.js

var createCategory = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody) {
    var category;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          category = new _ServiceCategoryModel["default"](reqBody);
          _context.next = 1;
          return category.save();
        case 1:
          return _context.abrupt("return", category);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createCategory(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateCategory = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, reqBody) {
    var updated;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 1;
          return _ServiceCategoryModel["default"].findByIdAndUpdate(id, reqBody, {
            "new": true
          });
        case 1:
          updated = _context2.sent;
          if (updated) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 2:
          return _context2.abrupt("return", updated);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateCategory(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var getAllCategories = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _ServiceCategoryModel["default"].find().sort({
            createdAt: -1
          });
        case 1:
          return _context3.abrupt("return", _context3.sent);
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getAllCategories() {
    return _ref3.apply(this, arguments);
  };
}();
var getCategoryById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    var category;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _ServiceCategoryModel["default"].findById(id);
        case 1:
          category = _context4.sent;
          if (category) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 2:
          return _context4.abrupt("return", category);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getCategoryById(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var getCategoryBySlug = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(slug) {
    var category;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 1;
          return _ServiceCategoryModel["default"].findOne({
            slug: slug
          });
        case 1:
          category = _context5.sent;
          if (category) {
            _context5.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 2:
          return _context5.abrupt("return", category);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getCategoryBySlug(_x5) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteCategory = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
    var hasServices, deleted;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return _Service["default"].exists({
            category: id
          });
        case 1:
          hasServices = _context6.sent;
          if (!hasServices) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Không thể xóa, còn dịch vụ thuộc category này');
        case 2:
          _context6.next = 3;
          return _ServiceCategoryModel["default"].findByIdAndDelete(id);
        case 3:
          deleted = _context6.sent;
          if (deleted) {
            _context6.next = 4;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 4:
          return _context6.abrupt("return", deleted);
        case 5:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function deleteCategory(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var serviceCategoryService = exports.serviceCategoryService = {
  createCategory: createCategory,
  updateCategory: updateCategory,
  getAllCategories: getAllCategories,
  getCategoryById: getCategoryById,
  getCategoryBySlug: getCategoryBySlug,
  deleteCategory: deleteCategory
};