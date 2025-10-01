"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infoRoute = void 0;
var _express = _interopRequireDefault(require("express"));
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _infoController = require("../controllers/info.controller.js");
var _upload = require("../middlewares/upload.middleware");
var Router = _express["default"].Router();
Router.get('/', _infoController.infoController.getAll);
Router.post('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _upload.uploadFile.fields([{
  name: 'terms',
  maxCount: 1
}, {
  name: 'policy',
  maxCount: 1
}]), _infoController.infoController.create);
Router.put('/', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _upload.uploadFile.fields([{
  name: 'terms',
  maxCount: 1
}, {
  name: 'policy',
  maxCount: 1
}]), _infoController.infoController.update);
var infoRoute = exports.infoRoute = Router;