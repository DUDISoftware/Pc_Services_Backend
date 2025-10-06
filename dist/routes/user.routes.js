"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _userValidation = require("../validations/user.validation.js");
var _userController = require("../controllers/user.controller.js");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var Router = _express["default"].Router();
Router.get('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _userController.userController.getAllUsers);
Router.put('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _userValidation.userValidation.updateUser, _userController.userController.updateUser);
Router.get('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _userValidation.userValidation.deleteUser, _userController.userController.getUserById);
Router["delete"]('/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _userValidation.userValidation.deleteUser, _userController.userController.deleteUser);
var userRoute = exports.userRoute = Router;