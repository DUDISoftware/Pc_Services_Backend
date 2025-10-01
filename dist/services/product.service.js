"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _Product = _interopRequireDefault(require("../models/Product.model"));
var _cloudinary = require("../utils/cloudinary.js");
var _redis = require("../config/redis.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createProduct = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody, files) {
    var newProductData, newProduct;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          newProductData = _objectSpread(_objectSpread({}, reqBody), {}, {
            images: (files === null || files === void 0 ? void 0 : files.map(function (file) {
              return {
                url: file.path,
                public_id: file.filename
              };
            })) || []
          });
          newProduct = new _Product["default"](newProductData);
          _context.next = 1;
          return newProduct.save();
        case 1:
          return _context.abrupt("return", newProduct);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createProduct(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var updateProduct = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, reqBody, files) {
    var updateData, updated;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          });
          if (files && files.length > 0) {
            updateData.images = files.map(function (file) {
              return {
                url: file.path,
                public_id: file.filename
              };
            });
          }
          _context2.next = 1;
          return _Product["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          });
        case 1:
          updated = _context2.sent;
          if (updated) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          return _context2.abrupt("return", updated);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateProduct(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var updateQuantity = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id, quantity) {
    var updated;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _Product["default"].findByIdAndUpdate(id, {
            quantity: quantity
          }, {
            "new": true
          });
        case 1:
          updated = _context3.sent;
          if (updated) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          return _context3.abrupt("return", updated);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function updateQuantity(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteProduct = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    var result;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _Product["default"].findByIdAndDelete(id);
        case 1:
          result = _context4.sent;
          if (result) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          if (!(result.images && result.images.length > 0)) {
            _context4.next = 3;
            break;
          }
          _context4.next = 3;
          return Promise.all(result.images.map(function (image) {
            return (0, _cloudinary.deleteImage)(image.public_id);
          }));
        case 3:
          return _context4.abrupt("return", result);
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function deleteProduct(_x8) {
    return _ref4.apply(this, arguments);
  };
}();

// ✅ GET all products (with pagination)
var getAllProducts = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var page,
      limit,
      skip,
      products,
      total,
      _args5 = arguments;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          page = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : 1;
          limit = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 10;
          skip = (page - 1) * limit;
          _context5.next = 1;
          return _Product["default"].find().populate('category_id', 'name slug').skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          products = _context5.sent;
          _context5.next = 2;
          return _Product["default"].countDocuments();
        case 2:
          total = _context5.sent;
          return _context5.abrupt("return", {
            status: 'success',
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            products: products
          });
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getAllProducts() {
    return _ref5.apply(this, arguments);
  };
}();
var getFeaturedProducts = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var limit,
      _args6 = arguments;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          limit = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : 8;
          _context6.next = 1;
          return _Product["default"].find({
            is_featured: true,
            status: 'available'
          }).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          return _context6.abrupt("return", _context6.sent);
        case 2:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function getFeaturedProducts() {
    return _ref6.apply(this, arguments);
  };
}();
// product.service.js
var getRelatedProducts = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(productId) {
    var limit,
      product,
      related,
      _args7 = arguments;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          limit = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 4;
          _context7.next = 1;
          return _Product["default"].findById(productId);
        case 1:
          product = _context7.sent;
          if (product) {
            _context7.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          _context7.next = 3;
          return _Product["default"].find({
            category_id: product.category_id,
            _id: {
              $ne: productId
            },
            status: 'available'
          }).limit(limit).sort({
            createdAt: -1
          });
        case 3:
          related = _context7.sent;
          return _context7.abrupt("return", related);
        case 4:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function getRelatedProducts(_x9) {
    return _ref7.apply(this, arguments);
  };
}();

// ✅ GET product by ID
var getProductById = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(id) {
    var product;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 1;
          return _Product["default"].findById(id).populate('category_id', 'name');
        case 1:
          product = _context8.sent;
          if (product) {
            _context8.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          return _context8.abrupt("return", product);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function getProductById(_x0) {
    return _ref8.apply(this, arguments);
  };
}();

// ✅ GET products by Category
var getProductsByCategory = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(categoryId) {
    var page,
      limit,
      skip,
      products,
      total,
      _args9 = arguments;
    return _regenerator["default"].wrap(function (_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          page = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : 1;
          limit = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : 10;
          skip = (page - 1) * limit;
          _context9.next = 1;
          return _Product["default"].find({
            category_id: categoryId
          }).populate('category_id', 'name slug').skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          products = _context9.sent;
          _context9.next = 2;
          return _Product["default"].countDocuments({
            category_id: categoryId
          });
        case 2:
          total = _context9.sent;
          return _context9.abrupt("return", {
            status: 'success',
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            products: products
          });
        case 3:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function getProductsByCategory(_x1) {
    return _ref9.apply(this, arguments);
  };
}();
var getProductBySlug = /*#__PURE__*/function () {
  var _ref0 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee0(slug) {
    var product;
    return _regenerator["default"].wrap(function (_context0) {
      while (1) switch (_context0.prev = _context0.next) {
        case 0:
          _context0.next = 1;
          return _Product["default"].findOne({
            slug: slug
          }).populate('category_id', 'name slug');
        case 1:
          product = _context0.sent;
          if (product) {
            _context0.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Product not found');
        case 2:
          return _context0.abrupt("return", product);
        case 3:
        case "end":
          return _context0.stop();
      }
    }, _callee0);
  }));
  return function getProductBySlug(_x10) {
    return _ref0.apply(this, arguments);
  };
}();
var getProductViews = /*#__PURE__*/function () {
  var _ref1 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee1(id) {
    var key, views;
    return _regenerator["default"].wrap(function (_context1) {
      while (1) switch (_context1.prev = _context1.next) {
        case 0:
          key = "product:".concat(id, ":views");
          _context1.next = 1;
          return _redis.redisClient.get(key);
        case 1:
          views = _context1.sent;
          return _context1.abrupt("return", views ? parseInt(views, 10) : 0);
        case 2:
        case "end":
          return _context1.stop();
      }
    }, _callee1);
  }));
  return function getProductViews(_x11) {
    return _ref1.apply(this, arguments);
  };
}();
var countViewRedis = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(id) {
    var key, views;
    return _regenerator["default"].wrap(function (_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          key = "product:".concat(id, ":views");
          _context10.next = 1;
          return _redis.redisClient.incrBy(key, 1);
        case 1:
          views = _context10.sent;
          _context10.next = 2;
          return _redis.redisClient.expire(key, 60 * 60 * 24 * 7);
        case 2:
          return _context10.abrupt("return", views);
        case 3:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function countViewRedis(_x12) {
    return _ref10.apply(this, arguments);
  };
}();
var productService = exports.productService = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  updateQuantity: updateQuantity,
  deleteProduct: deleteProduct,
  getAllProducts: getAllProducts,
  getProductById: getProductById,
  getProductsByCategory: getProductsByCategory,
  getFeaturedProducts: getFeaturedProducts,
  getRelatedProducts: getRelatedProducts,
  getProductBySlug: getProductBySlug,
  getProductViews: getProductViews,
  countViewRedis: countViewRedis
};