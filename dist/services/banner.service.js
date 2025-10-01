"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bannerService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
var _httpStatusCodes = require("http-status-codes");
var _BannerModel = _interopRequireDefault(require("../models/Banner.model.js"));
var _cloudinary = require("../utils/cloudinary.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// Hàm xác định size theo layout + position
var getSizeByLayout = function getSizeByLayout(layout, position) {
  if (layout === 1) {
    // Option 1: 1 lớn trái + 2 nhỏ phải
    return position === 1 ? 'large' : 'small';
  }
  if (layout === 2) {
    // Option 2: 1 banner lớn, nếu thêm slot 2 thì = small
    return position === 1 ? 'large' : 'small';
  }
  if (layout === 3) {
    // Option 3: 2 banner lớn
    return 'large';
  }
  return 'large';
};
var getAllBanners = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var banners;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 1;
          return _BannerModel["default"].find().sort({
            createdAt: -1
          }).lean();
        case 1:
          banners = _context.sent;
          return _context.abrupt("return", banners);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getAllBanners() {
    return _ref.apply(this, arguments);
  };
}();
var createBanner = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(reqBody, file) {
    var layout, position, bannerData, banner;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          layout = reqBody.layout, position = reqBody.position;
          bannerData = _objectSpread(_objectSpread({}, reqBody), {}, {
            size: getSizeByLayout(Number(layout), Number(position)),
            // ✅ set size tự động
            image: {
              url: file.path,
              public_id: file.filename
            }
          });
          banner = new _BannerModel["default"](bannerData);
          _context2.next = 1;
          return banner.save();
        case 1:
          return _context2.abrupt("return", banner);
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function createBanner(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
var updateBanner = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id, reqBody, file) {
    var layout, position, updateBannerData, _existingBanner$image, existingBanner, banner;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          layout = reqBody.layout, position = reqBody.position;
          updateBannerData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          }); // Nếu có layout + position thì update size lại
          if (layout && position !== undefined) {
            updateBannerData.size = getSizeByLayout(Number(layout), Number(position));
          }
          if (!file) {
            _context3.next = 3;
            break;
          }
          _context3.next = 1;
          return _BannerModel["default"].findById(id);
        case 1:
          existingBanner = _context3.sent;
          if (!(existingBanner !== null && existingBanner !== void 0 && (_existingBanner$image = existingBanner.image) !== null && _existingBanner$image !== void 0 && _existingBanner$image.public_id)) {
            _context3.next = 2;
            break;
          }
          _context3.next = 2;
          return (0, _cloudinary.deleteImage)(existingBanner.image.public_id);
        case 2:
          updateBannerData.image = {
            url: file.path,
            public_id: file.filename
          };
        case 3:
          _context3.next = 4;
          return _BannerModel["default"].findByIdAndUpdate(id, updateBannerData, {
            "new": true
          });
        case 4:
          banner = _context3.sent;
          if (banner) {
            _context3.next = 5;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Banner not found');
        case 5:
          return _context3.abrupt("return", banner);
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function updateBanner(_x3, _x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteBanner = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    var _deletedBanner$image;
    var deletedBanner;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _BannerModel["default"].findByIdAndDelete(id);
        case 1:
          deletedBanner = _context4.sent;
          if (deletedBanner) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Banner not found');
        case 2:
          if (!((_deletedBanner$image = deletedBanner.image) !== null && _deletedBanner$image !== void 0 && _deletedBanner$image.public_id)) {
            _context4.next = 3;
            break;
          }
          _context4.next = 3;
          return (0, _cloudinary.deleteImage)(deletedBanner.image.public_id);
        case 3:
          return _context4.abrupt("return", deletedBanner);
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function deleteBanner(_x6) {
    return _ref4.apply(this, arguments);
  };
}();
var bannerService = exports.bannerService = {
  getAllBanners: getAllBanners,
  createBanner: createBanner,
  updateBanner: updateBanner,
  deleteBanner: deleteBanner
};