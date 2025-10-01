"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoryController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _category = require("../services/category.service");
var _search = require("../services/search.service");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createCategory = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var category, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _category.categoryService.createCategory(req.body);
        case 1:
          category = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo danh mục thành công',
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
var getCategories = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$query, _req$query$page, page, _req$query$limit, limit, data, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          page = parseInt(page);
          limit = parseInt(limit);
          _context2.next = 1;
          return _category.categoryService.getCategories(page, limit);
        case 1:
          data = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(_objectSpread({
            status: 'success'
          }, data));
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
  return function getCategories(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getCategoryById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var id, category, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 1;
          return _category.categoryService.getCategoryById(id);
        case 1:
          category = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            category: category
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
  return function getCategoryById(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getCategoryBySlug = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var slug, category, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          slug = req.params.slug;
          _context4.next = 1;
          return _category.categoryService.getCategoryBySlug(slug);
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
  return function getCategoryBySlug(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var updateCategory = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var id, updatedCategory, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 1;
          return _category.categoryService.updateCategory(id, req.body);
        case 1:
          updatedCategory = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật danh mục thành công',
            category: updatedCategory
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
  return function updateCategory(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteCategory = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var id, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id;
          _context6.next = 1;
          return _category.categoryService.deleteCategory(id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xoá danh mục thành công'
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
    var query, _req$query2, _req$query2$page, page, _req$query2$limit, limit, categories, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          query = req.query.query;
          if (!(!query || query.trim() === '')) {
            _context7.next = 1;
            break;
          }
          return _context7.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message: 'Query parameter is required'
          }));
        case 1:
          _req$query2 = req.query, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 10 : _req$query2$limit;
          page = parseInt(page);
          limit = parseInt(limit);
          _context7.next = 2;
          return (0, _search.searchCategories)(query, page, limit);
        case 2:
          categories = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            page: page,
            limit: limit,
            results: categories.length,
            categories: categories
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
var categoryController = exports.categoryController = {
  createCategory: createCategory,
  getCategories: getCategories,
  getCategoryById: getCategoryById,
  getCategoryBySlug: getCategoryBySlug,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
  searchCategories: searchCategories
};