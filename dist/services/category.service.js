"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoryService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _Category = _interopRequireDefault(require("../models/Category.model"));
var _Product = _interopRequireDefault(require("../models/Product.model"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Create category
 */
var createCategory = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody) {
    var category;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          category = new _Category["default"](reqBody);
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

/**
 * Get all categories with pagination
 */
var getCategories = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var page,
      limit,
      skip,
      _yield$Promise$all,
      _yield$Promise$all2,
      categories,
      total,
      _args2 = arguments;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          page = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 1;
          limit = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 10;
          page = parseInt(page);
          limit = parseInt(limit);
          skip = (page - 1) * limit;
          _context2.next = 1;
          return Promise.all([_Category["default"].find().sort({
            createdAt: -1
          }).skip(skip).limit(limit), _Category["default"].countDocuments()]);
        case 1:
          _yield$Promise$all = _context2.sent;
          _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
          categories = _yield$Promise$all2[0];
          total = _yield$Promise$all2[1];
          return _context2.abrupt("return", {
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            categories: categories
          });
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getCategories() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Get category by id
 */
var getCategoryById = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var category;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _Category["default"].findById(id);
        case 1:
          category = _context3.sent;
          if (category) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 2:
          return _context3.abrupt("return", category);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getCategoryById(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
var getCategoryBySlug = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(slug) {
    var category;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _Category["default"].findOne({
            slug: slug
          });
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
  return function getCategoryBySlug(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Update category
 */
var updateCategory = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id, reqBody) {
    var updateData, category;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          });
          _context5.next = 1;
          return _Category["default"].findByIdAndUpdate(id, updateData, {
            "new": true
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
  return function updateCategory(_x4, _x5) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Delete category + detach products
 */
var deleteCategory = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
    var deletedCategory;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return _Category["default"].findByIdAndDelete(id);
        case 1:
          deletedCategory = _context6.sent;
          if (deletedCategory) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Category not found');
        case 2:
          _context6.next = 3;
          return _Product["default"].updateMany({
            category_id: id
          }, {
            $set: {
              category_id: null
            }
          });
        case 3:
          return _context6.abrupt("return", deletedCategory);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function deleteCategory(_x6) {
    return _ref6.apply(this, arguments);
  };
}();
var categoryService = exports.categoryService = {
  createCategory: createCategory,
  getCategories: getCategories,
  getCategoryById: getCategoryById,
  getCategoryBySlug: getCategoryBySlug,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory
};