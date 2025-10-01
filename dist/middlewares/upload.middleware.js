"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = exports.uploadFile = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _multer = _interopRequireDefault(require("multer"));
var _multerStorageCloudinary = require("multer-storage-cloudinary");
var _cloudinary = require("../config/cloudinary");
var cloudinaryStorage = new _multerStorageCloudinary.CloudinaryStorage({
  cloudinary: _cloudinary.cloudinary,
  params: function () {
    var _params = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, file) {
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", {
              folder: 'images',
              format: file.mimetype.split('/')[1],
              public_id: Date.now() + '-' + file.originalname.split('.')[0],
              resource_type: 'image'
            });
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function params(_x, _x2) {
      return _params.apply(this, arguments);
    }
    return params;
  }()
});
var uploadImage = exports.uploadImage = (0, _multer["default"])({
  storage: cloudinaryStorage
});
var cloudinaryFileStorage = new _multerStorageCloudinary.CloudinaryStorage({
  cloudinary: _cloudinary.cloudinary,
  params: function () {
    var _params2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, file) {
      return _regenerator["default"].wrap(function (_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", {
              folder: 'documents',
              format: file.mimetype.split('/')[1],
              public_id: Date.now() + '-' + file.originalname.split('.')[0],
              resource_type: 'raw' // Use 'raw' for all file types, including pdf
            });
          case 1:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    function params(_x3, _x4) {
      return _params2.apply(this, arguments);
    }
    return params;
  }()
});
var uploadFile = exports.uploadFile = (0, _multer["default"])({
  storage: cloudinaryFileStorage
});