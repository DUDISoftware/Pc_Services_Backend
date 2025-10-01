"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categoryRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _category = require("../controllers/category.controller");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _category2 = require("../validations/category.validation");
var Router = _express["default"].Router();

// CRUD
Router.post('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _category2.categoryValidation.createCategory, _category.categoryController.createCategory);
Router.get('/', _category.categoryController.getCategories);
Router.get('/search', _category.categoryController.searchCategories);
Router.get('/:id', _category2.categoryValidation.getCategoryById, _category.categoryController.getCategoryById);
Router.get('/slug/:slug', _category2.categoryValidation.getCategoryBySlug, _category.categoryController.getCategoryBySlug);
Router.put('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _category2.categoryValidation.updateCategory, _category.categoryController.updateCategory);
Router["delete"]('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _category2.categoryValidation.deleteCategory, _category.categoryController.deleteCategory);
var categoryRoute = exports.categoryRoute = Router;