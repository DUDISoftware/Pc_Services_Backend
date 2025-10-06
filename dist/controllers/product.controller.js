"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _product = require("../services/product.service");
var _searchService = require("../services/search.service.js");
var createProduct = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var files, product, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          files = req.files;
          if (files) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Image files are required. Please send files with field name "images"'
          }));
        case 1:
          _context.next = 2;
          return _product.productService.createProduct(req.body, files);
        case 2:
          product = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo product thành công',
            product: product
          });
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](0);
          next(_t);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function createProduct(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
// product.controller.js
var getRelatedProducts = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var id, _req$query$limit, limit, products, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _req$query$limit = req.query.limit, limit = _req$query$limit === void 0 ? 4 : _req$query$limit;
          _context2.next = 1;
          return _product.productService.getRelatedProducts(id, Number(limit));
        case 1:
          products = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            products: products
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
  return function getRelatedProducts(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateProduct = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var id, files, updatedProduct, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          files = req.files;
          _context3.next = 1;
          return _product.productService.updateProduct(id, req.body, files);
        case 1:
          updatedProduct = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật product thành công',
            product: updatedProduct
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
  return function updateProduct(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var updateQuantity = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var id, quantity, updatedProduct, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          quantity = req.body.quantity;
          _context4.next = 1;
          return _product.productService.updateQuantity(id, quantity);
        case 1:
          updatedProduct = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật số lượng product thành công',
            product: updatedProduct
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
  return function updateQuantity(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var deleteProduct = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var id, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 1;
          return _product.productService.deleteProduct(id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xoá product thành công'
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
  return function deleteProduct(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
// product.controller.js
var getFeaturedProducts = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$query$limit2, limit, products, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query$limit2 = req.query.limit, limit = _req$query$limit2 === void 0 ? 8 : _req$query$limit2;
          _context6.next = 1;
          return _product.productService.getFeaturedProducts(Number(limit));
        case 1:
          products = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            products: products
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
  return function getFeaturedProducts(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();

// ✅ GET all products
var getAllProducts = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var _req$query, _req$query$page, page, _req$query$limit3, limit, data, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit3 = _req$query.limit, limit = _req$query$limit3 === void 0 ? 10 : _req$query$limit3;
          _context7.next = 1;
          return _product.productService.getAllProducts(Number(page), Number(limit));
        case 1:
          data = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(data);
          _context7.next = 3;
          break;
        case 2:
          _context7.prev = 2;
          _t7 = _context7["catch"](0);
          next(_t7);
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return function getAllProducts(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();

// ✅ GET product by ID
var getProductById = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var id, product, _t8;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          id = req.params.id;
          _context8.next = 1;
          return _product.productService.getProductById(id);
        case 1:
          product = _context8.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            product: product
          });
          _context8.next = 3;
          break;
        case 2:
          _context8.prev = 2;
          _t8 = _context8["catch"](0);
          next(_t8);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function getProductById(_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}();

// ✅ GET products by category
var getProductsByCategory = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
    var categoryId, _req$query2, _req$query2$page, page, _req$query2$limit, limit, data, _t9;
    return _regenerator["default"].wrap(function (_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          categoryId = req.params.categoryId;
          _req$query2 = req.query, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 10 : _req$query2$limit;
          _context9.next = 1;
          return _product.productService.getProductsByCategory(categoryId, Number(page), Number(limit));
        case 1:
          data = _context9.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json(data);
          _context9.next = 3;
          break;
        case 2:
          _context9.prev = 2;
          _t9 = _context9["catch"](0);
          next(_t9);
        case 3:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return function getProductsByCategory(_x23, _x24, _x25) {
    return _ref9.apply(this, arguments);
  };
}();
var getProductBySlug = /*#__PURE__*/function () {
  var _ref0 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee0(req, res, next) {
    var slug, product, _t0;
    return _regenerator["default"].wrap(function (_context0) {
      while (1) switch (_context0.prev = _context0.next) {
        case 0:
          _context0.prev = 0;
          slug = req.params.slug;
          _context0.next = 1;
          return _product.productService.getProductBySlug(slug);
        case 1:
          product = _context0.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            product: product
          });
          _context0.next = 3;
          break;
        case 2:
          _context0.prev = 2;
          _t0 = _context0["catch"](0);
          next(_t0);
        case 3:
        case "end":
          return _context0.stop();
      }
    }, _callee0, null, [[0, 2]]);
  }));
  return function getProductBySlug(_x26, _x27, _x28) {
    return _ref0.apply(this, arguments);
  };
}();
var searchProducts = /*#__PURE__*/function () {
  var _ref1 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee1(req, res, next) {
    var _req$query3, query, _req$query3$page, page, _req$query3$limit, limit, products, _t1;
    return _regenerator["default"].wrap(function (_context1) {
      while (1) switch (_context1.prev = _context1.next) {
        case 0:
          _context1.prev = 0;
          _req$query3 = req.query, query = _req$query3.query, _req$query3$page = _req$query3.page, page = _req$query3$page === void 0 ? 1 : _req$query3$page, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === void 0 ? 10 : _req$query3$limit;
          if (!(!query || query.trim() === '')) {
            _context1.next = 1;
            break;
          }
          return _context1.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message: 'Query parameter is required'
          }));
        case 1:
          _context1.next = 2;
          return _searchService.searchService.searchProducts(query, Number(page), Number(limit));
        case 2:
          products = _context1.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            page: Number(page),
            limit: Number(limit),
            results: products.length,
            products: products
          });
          _context1.next = 4;
          break;
        case 3:
          _context1.prev = 3;
          _t1 = _context1["catch"](0);
          next(_t1);
        case 4:
        case "end":
          return _context1.stop();
      }
    }, _callee1, null, [[0, 3]]);
  }));
  return function searchProducts(_x29, _x30, _x31) {
    return _ref1.apply(this, arguments);
  };
}();
var getProductViews = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
    var id, views, _t10;
    return _regenerator["default"].wrap(function (_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id;
          _context10.next = 1;
          return _product.productService.getProductViews(id);
        case 1:
          views = _context10.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            views: views
          });
          _context10.next = 3;
          break;
        case 2:
          _context10.prev = 2;
          _t10 = _context10["catch"](0);
          next(_t10);
        case 3:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 2]]);
  }));
  return function getProductViews(_x32, _x33, _x34) {
    return _ref10.apply(this, arguments);
  };
}();
var countViewRedis = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
    var id, views, _t11;
    return _regenerator["default"].wrap(function (_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          id = req.params.id;
          _context11.next = 1;
          return _product.productService.countViewRedis(id);
        case 1:
          views = _context11.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            views: views
          });
          _context11.next = 3;
          break;
        case 2:
          _context11.prev = 2;
          _t11 = _context11["catch"](0);
          next(_t11);
        case 3:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 2]]);
  }));
  return function countViewRedis(_x35, _x36, _x37) {
    return _ref11.apply(this, arguments);
  };
}();
var productController = exports.productController = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  updateQuantity: updateQuantity,
  deleteProduct: deleteProduct,
  getAllProducts: getAllProducts,
  getProductById: getProductById,
  getProductsByCategory: getProductsByCategory,
  getProductBySlug: getProductBySlug,
  getFeaturedProducts: getFeaturedProducts,
  getRelatedProducts: getRelatedProducts,
  searchProducts: searchProducts,
  getProductViews: getProductViews,
  countViewRedis: countViewRedis
};