"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceController = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _httpStatusCodes = require("http-status-codes");
var _customerService = require("../services/customerService.service");
var _searchService = require("../services/search.service.js");
var createService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var service, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return _customerService.serviceService.createService(req.body);
        case 1:
          service = _context.sent;
          res.status(_httpStatusCodes.StatusCodes.CREATED).json({
            status: 'success',
            message: 'Tạo dịch vụ thành công',
            service: service
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
  return function createService(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var updateService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
    var id, updated, _t2;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          id = req.params.id;
          _context2.next = 1;
          return _customerService.serviceService.updateService(id, req.body);
        case 1:
          updated = _context2.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Cập nhật dịch vụ thành công',
            service: updated
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
  return function updateService(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
var hideService = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
    var id, _t3;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 1;
          return _customerService.serviceService.hideService(id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Ẩn dịch vụ thành công'
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
  return function hideService(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
var getAllServices = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
    var services, _t4;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 1;
          return _customerService.serviceService.getAllServices();
        case 1:
          services = _context4.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            services: services
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
  return function getAllServices(_x0, _x1, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var getServiceById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
    var id, service, _t5;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 1;
          return _customerService.serviceService.getServiceById(id);
        case 1:
          service = _context5.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            service: service
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
  return function getServiceById(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
var getServiceBySlug = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
    var slug, service, _t6;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          slug = req.params.slug;
          _context6.next = 1;
          return _customerService.serviceService.getServiceBySlug(slug);
        case 1:
          service = _context6.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            service: service
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
  return function getServiceBySlug(_x14, _x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
var deleteService = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
    var id, _t7;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _context7.next = 1;
          return _customerService.serviceService.deleteService(id);
        case 1:
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            message: 'Xóa dịch vụ thành công'
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
  return function deleteService(_x17, _x18, _x19) {
    return _ref7.apply(this, arguments);
  };
}();
var searchServices = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
    var _req$query, query, _req$query$page, page, _req$query$limit, limit, results, _t8;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$query = req.query, query = _req$query.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          if (!(!query || query.trim() === '')) {
            _context8.next = 1;
            break;
          }
          return _context8.abrupt("return", res.status(_httpStatusCodes.StatusCodes.BAD_REQUEST).json({
            status: 'fail',
            message: 'Query parameter is required'
          }));
        case 1:
          _context8.next = 2;
          return (0, _searchService.searchServices)(query, page, limit);
        case 2:
          results = _context8.sent;
          res.status(_httpStatusCodes.StatusCodes.OK).json({
            status: 'success',
            results: results
          });
          _context8.next = 4;
          break;
        case 3:
          _context8.prev = 3;
          _t8 = _context8["catch"](0);
          next(_t8);
        case 4:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 3]]);
  }));
  return function searchServices(_x20, _x21, _x22) {
    return _ref8.apply(this, arguments);
  };
}();
var serviceController = exports.serviceController = {
  createService: createService,
  updateService: updateService,
  hideService: hideService,
  getAllServices: getAllServices,
  getServiceById: getServiceById,
  getServiceBySlug: getServiceBySlug,
  deleteService: deleteService,
  searchServices: searchServices
};