"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _orderService = require("../services/order.service.js");
var _searchService = require("../services/search.service.js");
var createRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var request, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _orderService.orderService.createRequest(req.body);
        case 1:
          request = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo yêu cầu thành công',
            request: request
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
  return function createRequest(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateRequest = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var id, updatedRequest, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 1;
          return _orderService.orderService.updateRequest(id, req.body);
        case 1:
          updatedRequest = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật yêu cầu thành công',
            updatedRequest: updatedRequest
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
  return function updateRequest(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var hideRequest = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var id, hiddenRequest, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 1;
          return _orderService.orderService.hideRequest(id);
        case 1:
          hiddenRequest = _context3.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Yêu cầu đã được ẩn',
            hiddenRequest: hiddenRequest
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
  return function hideRequest(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getAllRequests = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var _req$query, _req$query$page, page, _req$query$limit, limit, requests, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          _context4.next = 1;
          return _orderService.orderService.getAllRequests(Number(page), Number(limit));
        case 1:
          requests = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            requests: requests
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
  return function getAllRequests(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var getRequestById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var id, request, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 1;
          return _orderService.orderService.getRequestById(id);
        case 1:
          request = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            request: request
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
  return function getRequestById(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var searchRequests = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var _req$query2, query, _req$query2$page, page, _req$query2$limit, limit, results, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$query2 = req.query, query = _req$query2.query, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 10 : _req$query2$limit;
          _context6.next = 1;
          return (0, _searchService.searchRequests)(query, Number(page), Number(limit));
        case 1:
          results = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            results: results
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
  return function searchRequests(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var getRequestsByStatus = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var status, _req$query3, _req$query3$page, page, _req$query3$limit, limit, requests, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          status = req.params.status;
          _req$query3 = req.query, _req$query3$page = _req$query3.page, page = _req$query3$page === void 0 ? 1 : _req$query3$page, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === void 0 ? 10 : _req$query3$limit;
          _context7.next = 1;
          return _orderService.orderService.getRequestsByStatus(status, Number(page), Number(limit));
        case 1:
          requests = _context7.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            requests: requests
          });
          _context7.next = 3;
          break;
        case 2:
          _context7.prev = 2;
          _t7 = _context7["catch"](0);
          next(_t7);
        case 3:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 2]]);
  }));
  return function getRequestsByStatus(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var orderController = exports.orderController = {
  createRequest: createRequest,
  updateRequest: updateRequest,
  hideRequest: hideRequest,
  getAllRequests: getAllRequests,
  getRequestById: getRequestById,
  searchRequests: searchRequests,
  getRequestsByStatus: getRequestsByStatus
};