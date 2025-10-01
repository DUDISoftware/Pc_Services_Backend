"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _statsService = require("../services/stats.service.js");
var _ApiError = _interopRequireDefault(require("../utils/ApiError.js"));
/* eslint-disable comma-dangle */

var parseValidDate = function parseValidDate(rawDate) {
  if (!rawDate || isNaN(Date.parse(rawDate))) {
    throw new _ApiError["default"](_httpStatusCodes.StatusCodes.BAD_REQUEST, 'Invalid or missing date');
  }
  return new Date(rawDate);
};
var createStats = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var rawDate, date, stats, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          rawDate = req.query.date;
          date = parseValidDate(rawDate);
          _context.next = 1;
          return _statsService.statsService.createStats(date);
        case 1:
          stats = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo thống kê thành công',
            stats: stats
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
  return function createStats(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var getAll = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var stats, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 1;
          return _statsService.statsService.getAll();
        case 1:
          stats = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            stats: stats
          });
          _context2.next = 3;
          break;
        case 2:
          _context2.prev = 2;
          _t2 = _context2["catch"](0);
          next(_t2);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function getAll(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var getByMonth = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var _req$params, month, year, stats, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$params = req.params, month = _req$params.month, year = _req$params.year;
          _context3.next = 1;
          return _statsService.statsService.getByMonth(Number(month), Number(year));
        case 1:
          stats = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            stats: stats
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
  return function getByMonth(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getStats = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var date, parsedDate, stats, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          date = req.params.date;
          parsedDate = parseValidDate(date);
          _context4.next = 1;
          return _statsService.statsService.getStats(parsedDate);
        case 1:
          stats = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            stats: stats
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
  return function getStats(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var updateStats = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var rawDate, date, stats, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          rawDate = req.query.date;
          date = parseValidDate(rawDate);
          _context5.next = 1;
          return _statsService.statsService.updateStats(req.body, date);
        case 1:
          stats = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật thống kê thành công',
            stats: stats
          });
          _context5.next = 3;
          break;
        case 2:
          _context5.prev = 2;
          _t5 = _context5["catch"](0);
          next(_t5);
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function updateStats(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var countVisit = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var rawDate, date, stats, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          rawDate = req.query.date;
          date = parseValidDate(rawDate);
          _context6.next = 1;
          return _statsService.statsService.countVisit(date);
        case 1:
          stats = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            stats: stats
          });
          _context6.next = 3;
          break;
        case 2:
          _context6.prev = 2;
          _t6 = _context6["catch"](0);
          next(_t6);
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function countVisit(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var statsController = exports.statsController = {
  createStats: createStats,
  getStats: getStats,
  getAll: getAll,
  getByMonth: getByMonth,
  updateStats: updateStats,
  countVisit: countVisit
};