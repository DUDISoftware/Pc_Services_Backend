"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bannerController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _bannerService = require("../services/banner.service.js");
var getAllBanners = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var banners, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _bannerService.bannerService.getAllBanners();
        case 1:
          banners = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            banners: banners
          });
          _context.next = 3;
          break;
        case 2:
          _context.prev = 2;
          _t = _context["catch"](0);
          next(_t);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function getAllBanners(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var createBanner = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var file, banner, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          file = req.file;
          if (file) {
            _context2.next = 1;
            break;
          }
          return _context2.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'error',
            message: 'Image file is required. Please send the file with field name "image"'
          }));
        case 1:
          _context2.next = 2;
          return _bannerService.bannerService.createBanner(req.body, file);
        case 2:
          banner = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo banner thành công',
            banner: banner
          });
          _context2.next = 4;
          break;
        case 3:
          _context2.prev = 3;
          _t2 = _context2["catch"](0);
          next(_t2);
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return function createBanner(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var updateBanner = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var id, file, updatedBanner, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          file = req.file;
          _context3.next = 1;
          return _bannerService.bannerService.updateBanner(id, req.body, file);
        case 1:
          updatedBanner = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật banner thành công',
            banner: updatedBanner
          });
          _context3.next = 3;
          break;
        case 2:
          _context3.prev = 2;
          _t3 = _context3["catch"](0);
          next(_t3);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function updateBanner(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteBanner = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var id, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 1;
          return _bannerService.bannerService.deleteBanner(id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xoá banner thành công'
          });
          _context4.next = 3;
          break;
        case 2:
          _context4.prev = 2;
          _t4 = _context4["catch"](0);
          next(_t4);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function deleteBanner(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var bannerController = exports.bannerController = {
  getAllBanners: getAllBanners,
  createBanner: createBanner,
  updateBanner: updateBanner,
  deleteBanner: deleteBanner
};