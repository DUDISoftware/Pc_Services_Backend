"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APIs = void 0;
var _express = _interopRequireDefault(require("express"));
var _authRoutes = require("./auth.routes.js");
var _bannerRoutes = require("./banner.routes.js");
var _productRoutes = require("./product.routes.js");
var _categoryRoutes = require("./category.routes.js");
var _userRoutes = require("./user.routes.js");
var _serviceRoutes = require("./service.routes.js");
var _serviceCategoryRoutes = require("./serviceCategory.routes.js");
var _requestRoutes = require("./request.routes.js");
var _ratingRoutes = require("./rating.routes.js");
var _statsRoutes = require("./stats.routes.js");
var _infoRoutes = require("./info.routes.js");
var Router = _express["default"].Router();
Router.get('/status', function (req, res) {
  res.status(200).json({
    message: 'API is running'
  });
});
Router.use('/auth', _authRoutes.authRoute);
Router.use('/users', _userRoutes.userRoute);
Router.use('/banners', _bannerRoutes.bannerRoute);
Router.use('/products', _productRoutes.productRoute);
Router.use('/categories', _categoryRoutes.categoryRoute);
Router.use('/services', _serviceRoutes.serviceRoute);
Router.use('/service-categories', _serviceCategoryRoutes.serviceCategoryRoute);
Router.use('/requests', _requestRoutes.requestRoute);
Router.use('/ratings', _ratingRoutes.ratingRoute);
Router.use('/stats', _statsRoutes.statsRoute);
Router.use('/info', _infoRoutes.infoRoute);
var APIs = exports.APIs = Router;