"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _Stats = _interopRequireDefault(require("../models/Stats.model"));
var createStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(date) {
    var exists, stats;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 1;
          return _Stats["default"].findOne({
            createdAt: {
              $gte: new Date(date.setHours(0, 0, 0, 0)),
              $lte: new Date(date.setHours(23, 59, 59, 999))
            }
          });
        case 1:
          exists = _context.sent;
          if (!exists) {
            _context.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Stats already exists for this date');
        case 2:
          stats = new _Stats["default"]({
            visits: 0,
            total_profit: 0,
            total_orders: 0,
            total_repairs: 0,
            total_products: 0,
            createdAt: date
          });
          _context.next = 3;
          return stats.save();
        case 3:
          return _context.abrupt("return", stats);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createStats(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getStats = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(date) {
    var start, end, stats;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          start = new Date(date.setHours(0, 0, 0, 0));
          end = new Date(date.setHours(23, 59, 59, 999));
          _context2.next = 1;
          return _Stats["default"].findOne({
            createdAt: {
              $gte: start,
              $lte: end
            }
          }).sort({
            createdAt: -1
          });
        case 1:
          stats = _context2.sent;
          if (stats) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'No stats found for this date');
        case 2:
          return _context2.abrupt("return", stats);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getStats(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getAll = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var stats;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 1;
          return _Stats["default"].find().sort({
            createdAt: -1
          }).limit(31);
        case 1:
          stats = _context3.sent;
          if (!(!stats || stats.length === 0)) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'No stats found');
        case 2:
          return _context3.abrupt("return", stats);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function getAll() {
    return _ref3.apply(this, arguments);
  };
}();
var getByMonth = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(month, year) {
    var start, end, stats;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          start = new Date(year, month - 1, 1);
          end = new Date(year, month, 0, 23, 59, 59, 999);
          _context4.next = 1;
          return _Stats["default"].find({
            createdAt: {
              $gte: start,
              $lte: end
            }
          }).sort({
            createdAt: -1
          });
        case 1:
          stats = _context4.sent;
          if (!(!stats || stats.length === 0)) {
            _context4.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'No stats found for this month');
        case 2:
          return _context4.abrupt("return", stats);
        case 3:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getByMonth(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();
var updateStats = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(reqBody, date) {
    var start, end, stats;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          start = new Date(date.setHours(0, 0, 0, 0));
          end = new Date(date.setHours(23, 59, 59, 999));
          _context5.next = 1;
          return _Stats["default"].findOne({
            createdAt: {
              $gte: start,
              $lte: end
            }
          }).sort({
            createdAt: -1
          });
        case 1:
          stats = _context5.sent;
          if (stats) {
            _context5.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'No stats found to update');
        case 2:
          stats.total_profit = parseFloat(reqBody.total_profit || stats.total_profit);
          stats.total_repairs = parseInt(reqBody.total_repairs || stats.total_repairs);
          stats.total_orders = parseInt(reqBody.total_orders || stats.total_orders);
          stats.total_products = parseInt(reqBody.total_products || stats.total_products);

          // stats.total_profit += parseFloat(reqBody.total_profit || 0)
          // stats.total_repairs += parseInt(reqBody.total_repairs || 0)
          // stats.total_orders += parseInt(reqBody.total_orders || 0)
          // stats.total_products += parseInt(reqBody.total_products || 0)
          _context5.next = 3;
          return stats.save();
        case 3:
          return _context5.abrupt("return", stats);
        case 4:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function updateStats(_x5, _x6) {
    return _ref5.apply(this, arguments);
  };
}();
var countVisit = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(date) {
    var start, end, stats;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          start = new Date(date.setHours(0, 0, 0, 0));
          end = new Date(date.setHours(23, 59, 59, 999));
          _context6.next = 1;
          return _Stats["default"].findOne({
            createdAt: {
              $gte: start,
              $lte: end
            }
          }).sort({
            createdAt: -1
          });
        case 1:
          stats = _context6.sent;
          if (stats) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'No stats found to count visit');
        case 2:
          stats.visits += 1;
          _context6.next = 3;
          return stats.save();
        case 3:
          return _context6.abrupt("return", stats);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function countVisit(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var statsService = exports.statsService = {
  createStats: createStats,
  getStats: getStats,
  getAll: getAll,
  getByMonth: getByMonth,
  updateStats: updateStats,
  countVisit: countVisit
};