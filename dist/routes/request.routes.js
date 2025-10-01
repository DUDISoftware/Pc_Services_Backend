"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestRoute = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _orderRequest = require("../controllers/orderRequest.controller");
var _order = require("../validations/order.validation");
var _repairRequest = require("../controllers/repairRequest.controller");
var _repair = require("../validations/repair.validation");
var _authMiddleware = require("../middlewares/auth.middleware.js");
var _search = require("../services/search.service");
var _uploadMiddleware = require("../middlewares/upload.middleware.js");
var Router = _express["default"].Router();
// Order Requests
Router.post('/orders', _order.orderValidation.createOrder, _orderRequest.orderController.createRequest);
Router.put('/orders/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _order.orderValidation.updateOrder, _orderRequest.orderController.updateRequest);
Router.patch('/orders/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _order.orderValidation.hideOrder, _orderRequest.orderController.hideRequest);
Router.get('/orders', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _orderRequest.orderController.getAllRequests); // ?page=1&limit=10
Router.get('/orders/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _order.orderValidation.getOrderById, _orderRequest.orderController.getRequestById);
Router.get('/orders/status/:status', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _order.orderValidation.getOrdersByStatus, _orderRequest.orderController.getRequestsByStatus);
Router.get('/orders/search', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _orderRequest.orderController.searchRequests); // ?query=abc&page=1&limit=10

// Repair Requests
Router.post('/repairs', _uploadMiddleware.uploadImage.array('images'), _repair.repairValidation.createRepair, _repairRequest.repairController.createRequest);
Router.put('/repairs/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _uploadMiddleware.uploadImage.array('images'), _repair.repairValidation.updateRepair, _repairRequest.repairController.updateRequest);
Router.patch('/repairs/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repair.repairValidation.hideRepair, _repairRequest.repairController.hideRequest);
Router["delete"]('/repairs/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repair.repairValidation.deleteRepair, _repairRequest.repairController.deleteRequest);
Router.get('/repairs', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repairRequest.repairController.getAllRequests); // ?page=1&limit=10
Router.get('/repairs/:id', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repair.repairValidation.getRepairById, _repairRequest.repairController.getRequestById);
Router.get('/repairs/service/:serviceId', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repair.repairValidation.getRepairsByService, _repairRequest.repairController.getRequestsByService);
Router.get('/repairs/status/:status', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repair.repairValidation.getRepairsByStatus, _repairRequest.repairController.getRequestsByStatus);
Router.get('/repairs/search', _authMiddleware.verifyToken, _authMiddleware.verifyAdmin, _repairRequest.repairController.searchRequests); // ?query=abc&page=1&limit=10

Router.get('/search', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$query, query, _req$query$page, page, _req$query$limit, limit, results, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, query = _req$query.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          _context.prev = 1;
          _context.next = 2;
          return _search.searchService.searchRequests(query, {
            page: page,
            limit: limit
          });
        case 2:
          results = _context.sent;
          res.json(results);
          _context.next = 4;
          break;
        case 3:
          _context.prev = 3;
          _t = _context["catch"](1);
          console.error('❌ Lỗi khi tìm kiếm:', _t);
          res.status(500).json({
            error: 'Lỗi khi tìm kiếm'
          });
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var requestRoute = exports.requestRoute = Router;