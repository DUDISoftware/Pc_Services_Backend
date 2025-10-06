"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _statsController = require("../controllers/stats.controller.js");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _statsValidation = require("../validations/stats.validation.js");
var Router = _express["default"].Router();
Router.get('/month/:month/:year', _statsValidation.statsValidation.getMonth, _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _statsController.statsController.getByMonth);
Router.get('/:date', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _statsController.statsController.getStats);
Router.get('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _statsController.statsController.getAll);
Router.post('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _statsController.statsController.createStats);
Router.put('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _statsValidation.statsValidation.updateStats, _statsController.statsController.updateStats);
Router.patch('/visit', _statsValidation.statsValidation.countVisit, _statsController.statsController.countVisit);
var statsRoute = exports.statsRoute = Router;