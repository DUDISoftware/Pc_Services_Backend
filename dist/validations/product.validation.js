"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productValidation = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _joi = _interopRequireDefault(require("joi"));
var _httpStatusCodes = require("http-status-codes");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _validators = require("../utils/validators");
var idValidationRule = _joi["default"].object({
  id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required()
});
var slugValidationRule = _joi["default"].object({
  slug: _joi["default"].string().max(200).trim().required()
});
var categoryIdValidationRule = _joi["default"].object({
  categoryId: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required()
});
var createProduct = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var createProductRule, data, validatedData, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          createProductRule = _joi["default"].object({
            name: _joi["default"].string().required().max(200).trim(),
            description: _joi["default"].string().optional().allow('').trim(),
            price: _joi["default"].number().required().min(0),
            quantity: _joi["default"].number().required().min(0),
            category_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required(),
            brand: _joi["default"].string().required().max(100).trim(),
            status: _joi["default"].string().valid('available', 'out_of_stock', 'hidden')["default"]('available'),
            tags: _joi["default"].array().items(_joi["default"].string().max(200).trim()).optional(),
            ports: _joi["default"].array().items(_joi["default"].string().max(100).trim()).optional(),
            model: _joi["default"].string().max(100).trim().optional(),
            resolution: _joi["default"].string().max(100).trim().optional(),
            size: _joi["default"].string().max(100).trim().optional(),
            panel: _joi["default"].string().max(100).trim().optional(),
            slug: _joi["default"].string().max(200).trim().required(),
            images: _joi["default"].array().items(_joi["default"].string().uri()).optional()
          });
          _context.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          _context.next = 2;
          return createProductRule.validateAsync(data, {
            abortEarly: false
          });
        case 2:
          validatedData = _context.sent;
          req.body = validatedData;
          next();
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t.message));
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function createProduct(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateProduct = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var updateProductRule, data, params, validatedParams, validatedData, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          updateProductRule = _joi["default"].object({
            name: _joi["default"].string().required().max(200).trim(),
            description: _joi["default"].string().optional().allow('').trim(),
            price: _joi["default"].number().required().min(0),
            quantity: _joi["default"].number().required().min(0),
            category_id: _joi["default"].string().pattern(_validators.OBJECT_ID_RULE).message(_validators.OBJECT_ID_RULE_MESSAGE).required(),
            brand: _joi["default"].string().required().max(100).trim(),
            status: _joi["default"].string().valid('available', 'out_of_stock', 'hidden')["default"]('available'),
            tags: _joi["default"].array().items(_joi["default"].string().max(200).trim()).optional(),
            ports: _joi["default"].array().items(_joi["default"].string().max(100).trim()).optional(),
            model: _joi["default"].string().max(100).trim().optional(),
            resolution: _joi["default"].string().max(100).trim().optional(),
            size: _joi["default"].string().max(100).trim().optional(),
            panel: _joi["default"].string().max(100).trim().optional(),
            slug: _joi["default"].string().max(200).trim().required(),
            images: _joi["default"].array().items(_joi["default"].string().uri()).optional()
          });
          _context2.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context2.next = 2;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 2:
          validatedParams = _context2.sent;
          _context2.next = 3;
          return updateProductRule.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validatedData = _context2.sent;
          req.body = validatedData;
          req.params = validatedParams;
          next();
          _context2.next = 5;
          break;
        case 4:
          _context2.prev = 4;
          _t2 = _context2["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t2.message));
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 4]]);
  }));
  return function updateProduct(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateQuantity = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var updateQuantityRule, data, params, validatedParams, validatedData, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          updateQuantityRule = _joi["default"].object({
            quantity: _joi["default"].number().required().min(0)
          });
          _context3.prev = 1;
          data = req !== null && req !== void 0 && req.body ? req.body : {};
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context3.next = 2;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 2:
          validatedParams = _context3.sent;
          _context3.next = 3;
          return updateQuantityRule.validateAsync(data, {
            abortEarly: false
          });
        case 3:
          validatedData = _context3.sent;
          req.body = validatedData;
          req.params = validatedParams;
          next();
          _context3.next = 5;
          break;
        case 4:
          _context3.prev = 4;
          _t3 = _context3["catch"](1);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t3.message));
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 4]]);
  }));
  return function updateQuantity(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteProduct = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var params, validatedParams, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context4.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context4.sent;
          req.params = validatedParams;
          next();
          _context4.next = 3;
          break;
        case 2:
          _context4.prev = 2;
          _t4 = _context4["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t4.message));
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function deleteProduct(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

// ✅ thêm validate cho GET by ID
var getProductById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var params, validatedParams, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context5.next = 1;
          return idValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context5.sent;
          req.params = validatedParams;
          next();
          _context5.next = 3;
          break;
        case 2:
          _context5.prev = 2;
          _t5 = _context5["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t5.message));
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function getProductById(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();

// ✅ thêm validate cho GET by category
var getProductsByCategory = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var params, validatedParams, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context6.next = 1;
          return categoryIdValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context6.sent;
          req.params = validatedParams;
          next();
          _context6.next = 3;
          break;
        case 2:
          _context6.prev = 2;
          _t6 = _context6["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t6.message));
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function getProductsByCategory(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var getProductBySlug = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var params, validatedParams, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          params = req !== null && req !== void 0 && req.params ? req.params : {};
          _context7.next = 1;
          return slugValidationRule.validateAsync(params, {
            abortEarly: false
          });
        case 1:
          validatedParams = _context7.sent;
          req.params = validatedParams;
          next();
          _context7.next = 3;
          break;
        case 2:
          _context7.prev = 2;
          _t7 = _context7["catch"](0);
          next(new _ApiError["default"](_httpStatusCodes.StatusCodes.UNPROCESSABLE_ENTITY, _t7.message));
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return function getProductBySlug(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var productValidation = exports.productValidation = {
  createProduct: createProduct,
  updateProduct: updateProduct,
  updateQuantity: updateQuantity,
  deleteProduct: deleteProduct,
  getProductBySlug: getProductBySlug,
  getProductById: getProductById,
  getProductsByCategory: getProductsByCategory
};