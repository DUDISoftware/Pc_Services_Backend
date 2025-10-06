"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceCategoryRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _serviceCategoryController = require("../controllers/serviceCategory.controller.js");
// src/routes/serviceCategory.routes.js

var Router = _express["default"].Router();

// Public
Router.get('/', _serviceCategoryController.serviceCategoryController.getAllCategories);
Router.get('/search', _serviceCategoryController.serviceCategoryController.searchCategories);
Router.get('/:id', _serviceCategoryController.serviceCategoryController.getCategoryById);
Router.get('/slug/:slug', _serviceCategoryController.serviceCategoryController.getCategoryBySlug);

// Admin
Router.post('/', _authMiddleware.verifyToken, _serviceCategoryController.serviceCategoryController.createCategory);
Router.put('/:id', _authMiddleware.verifyToken, _serviceCategoryController.serviceCategoryController.updateCategory);
Router["delete"]('/:id', _authMiddleware.verifyToken, _serviceCategoryController.serviceCategoryController.deleteCategory);
var serviceCategoryRoute = exports.serviceCategoryRoute = Router;