"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _userValidation = require("../validations/user.validation.js");
var _userController = require("../controllers/user.controller.js");
var Router = _express["default"].Router();
Router.post('/login', _userValidation.userValidation.login, _userController.userController.login);
Router.post('/register', _userValidation.userValidation.register, _userController.userController.register);
Router.get('/send-email', _userValidation.userValidation.sendEmail, _userController.userController.sendEmail);
Router.post('/send-otp', _userValidation.userValidation.sendOTP, _userController.userController.sendOTP);
Router.post('/verify-email', _userValidation.userValidation.verifyEmail, _userController.userController.verifyEmail);
var authRoute = exports.authRoute = Router;