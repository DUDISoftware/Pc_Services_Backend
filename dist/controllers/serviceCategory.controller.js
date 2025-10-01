"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceCategoryController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _serviceCategoryService = require("../services/serviceCategory.service.js");
var _searchService = require("../services/search.service.js");
// src/controllers/serviceCategory.controller.js

var createCategory = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var category, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _serviceCategoryService.serviceCategoryService.createCategory(req.body);
        case 1:
          category = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo danh mục dịch vụ thành công',
            category: category
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
  return function createCategory(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateCategory = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var category, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return _serviceCategoryService.serviceCategoryService.updateCategory(req.params.id, req.body);
        case 1:
          category = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật danh mục thành công',
            category: category
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
  return function updateCategory(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getAllCategories = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var categories, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 1;
          return _serviceCategoryService.serviceCategoryService.getAllCategories();
        case 1:
          categories = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            categories: categories
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
  return function getAllCategories(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getCategoryById = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var category, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 1;
          return _serviceCategoryService.serviceCategoryService.getCategoryById(req.params.id);
        case 1:
          category = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            category: category
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
  return function getCategoryById(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var getCategoryBySlug = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var category, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 1;
          return _serviceCategoryService.serviceCategoryService.getCategoryBySlug(req.params.slug);
        case 1:
          category = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            category: category
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
  return function getCategoryBySlug(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteCategory = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 1;
          return _serviceCategoryService.serviceCategoryService.deleteCategory(req.params.id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xóa danh mục dịch vụ thành công'
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
  return function deleteCategory(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var searchCategories = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var _req$query, query, _req$query$page, page, _req$query$limit, limit, results, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query = req.query, query = _req$query.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          if (!(!query || query.trim() === '')) {
            _context7.next = 1;
            break;
          }
          return _context7.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message: 'Query parameter is required'
          }));
        case 1:
          _context7.next = 2;
          return (0, _searchService.searchServiceCategories)(query, page, limit);
        case 2:
          results = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            results: results
          });
          _context7.next = 4;
          break;
        case 3:
          _context7.prev = 3;
          _t7 = _context7["catch"](0);
          next(_t7);
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 3]]);
  }));
  return function searchCategories(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var serviceCategoryController = exports.serviceCategoryController = {
  createCategory: createCategory,
  updateCategory: updateCategory,
  getAllCategories: getAllCategories,
  getCategoryById: getCategoryById,
  getCategoryBySlug: getCategoryBySlug,
  deleteCategory: deleteCategory,
  searchCategories: searchCategories
};