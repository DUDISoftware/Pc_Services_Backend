"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ratingRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _ratingController = require("../controllers/rating.controller.js");
var _ratingValidation = require("../validations/rating.validation.js");
var Router = _express["default"].Router();
Router.post('/', _ratingValidation.ratingValidation.createRating, _ratingController.ratingController.createRating);
Router.get('/product/:id', _ratingValidation.ratingValidation.getRatingByProduct, _ratingController.ratingController.getRatingByProduct);
Router.get('/service/:id', _ratingValidation.ratingValidation.getRatingByService, _ratingController.ratingController.getRatingByService);
Router["delete"]('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _ratingValidation.ratingValidation.deleteRating, _ratingController.ratingController.deleteRating);
var ratingRoute = exports.ratingRoute = Router;