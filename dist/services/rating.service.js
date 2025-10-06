"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ratingService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _RatingModel = _interopRequireDefault(require("../models/Rating.model.js"));
var createRating = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody) {
    var newRating;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          newRating = new _RatingModel["default"](reqBody);
          _context.next = 1;
          return newRating.save();
        case 1:
          return _context.abrupt("return", newRating);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createRating(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getRatingsByProductId = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id) {
    var page,
      limit,
      skip,
      ratings,
      _args2 = arguments;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          page = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 1;
          limit = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 10;
          skip = (page - 1) * limit;
          _context2.next = 1;
          return _RatingModel["default"].find({
            product_id: id
          }).skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          ratings = _context2.sent;
          return _context2.abrupt("return", ratings);
        case 2:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getRatingsByProductId(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getRatingsByServiceId = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var page,
      limit,
      skip,
      ratings,
      _args3 = arguments;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          page = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 1;
          limit = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 10;
          skip = (page - 1) * limit;
          _context3.next = 1;
          return _RatingModel["default"].find({
            service_id: id
          }).skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          ratings = _context3.sent;
          return _context3.abrupt("return", ratings);
        case 2:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getRatingsByServiceId(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteRating = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(id) {
    var deleted;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 1;
          return _RatingModel["default"].findByIdAndDelete(id);
        case 1:
          deleted = _context4.sent;
          if (deleted) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Rating not found');
        case 2:
          return _context4.abrupt("return", deleted);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function deleteRating(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var ratingService = exports.ratingService = {
  createRating: createRating,
  getRatingsByProductId: getRatingsByProductId,
  getRatingsByServiceId: getRatingsByServiceId,
  deleteRating: deleteRating
};