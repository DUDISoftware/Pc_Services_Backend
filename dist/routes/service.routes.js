"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _service = require("../controllers/service.controller");
var _serviceValidation = require("../validations/service.validation.js");
var Router = _express["default"].Router();

// Public routes (không cần token)
Router.get('/', _service.serviceController.getAllServices);
Router.get('/search', _service.serviceController.searchServices);
Router.get('/:id', _service.serviceController.getServiceById);
Router.get('/slug/:slug', _serviceValidation.serviceValidation.getServiceBySlug, _service.serviceController.getServiceBySlug);

// Admin routes (cần token)
Router.post('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _serviceValidation.serviceValidation.createService, _service.serviceController.createService);
Router.put('/:id', _authMiddleware.verifyToken, _serviceValidation.serviceValidation.updateService, _service.serviceController.updateService);
Router.patch('/:id/hide', _authMiddleware.verifyToken, _service.serviceController.hideService);
Router["delete"]('/:id', _authMiddleware.verifyToken, _service.serviceController.deleteService);
var serviceRoute = exports.serviceRoute = Router;