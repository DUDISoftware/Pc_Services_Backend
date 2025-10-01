"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _uploadMiddleware = require("../middlewares/upload.middleware.js");
var _productController = require("../controllers/product.controller.js");
var _productValidation = require("../validations/product.validation.js");
var Router = _express["default"].Router();

// CRUD
Router.post('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _uploadMiddleware.uploadImage.array('images'), _productValidation.productValidation.createProduct, _productController.productController.createProduct);
Router.put('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _uploadMiddleware.uploadImage.array('images'), _productValidation.productValidation.updateProduct, _productController.productController.updateProduct);
Router["delete"]('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _productValidation.productValidation.deleteProduct, _productController.productController.deleteProduct);
Router.patch('/:id/quantity', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _productValidation.productValidation.updateQuantity, _productController.productController.updateQuantity);

// ✅ GET APIs
Router.get('/', _productController.productController.getAllProducts); // ?page=1&limit=10
// product.route.js
Router.get('/featured', _productController.productController.getFeaturedProducts);
Router.get('/search', _productController.productController.searchProducts); // ?query=abc&page=1&limit=10
Router.get('/slug/:slug', _productValidation.productValidation.getProductBySlug, _productController.productController.getProductBySlug);
Router.get('/category/:categoryId', _productController.productController.getProductsByCategory);
Router.get('/:id', _productController.productController.getProductById);
// product.route.js
Router.get('/:id/related', _productController.productController.getRelatedProducts);

// Store in Redis
Router.get('/:id/views', _productValidation.productValidation.getProductById, _productController.productController.getProductViews);
Router.post('/:id/views', _productValidation.productValidation.getProductById, _productController.productController.countViewRedis);
var productRoute = exports.productRoute = Router;