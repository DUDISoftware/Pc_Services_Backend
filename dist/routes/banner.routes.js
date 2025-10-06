"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bannerRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _bannerController = require("../controllers/banner.controller.js");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _uploadMiddleware = require("../middlewares/upload.middleware.js");
var _bannerValidation = require("../validations/banner.validation.js");
var Router = _express["default"].Router();
Router.get('/', _bannerController.bannerController.getAllBanners);
Router.post('/',
// verifyToken, verifyAdmin,
_uploadMiddleware.uploadImage.single('image'), _bannerValidation.bannerValidation.createBanner, _bannerController.bannerController.createBanner);
Router.put('/:id',
// verifyToken, verifyAdmin,
_uploadMiddleware.uploadImage.single('image'), _bannerValidation.bannerValidation.updateBanner, _bannerController.bannerController.updateBanner);
Router["delete"]('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _bannerValidation.bannerValidation.deleteBanner, _bannerController.bannerController.deleteBanner);
var bannerRoute = exports.bannerRoute = Router;