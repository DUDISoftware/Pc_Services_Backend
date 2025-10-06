"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _Product = _interopRequireDefault(require("../models/Product.model"));
var _Category = _interopRequireDefault(require("../models/Category.model"));
var _Service = _interopRequireDefault(require("../models/Service.model"));
var _ServiceCategory = _interopRequireDefault(require("../models/ServiceCategory.model"));
var _RepairRequestModel = _interopRequireDefault(require("../models/RepairRequest.model.js"));
var _OrderRequestModel = _interopRequireDefault(require("../models/OrderRequest.model.js"));
var _redis = require("../config/redis.js");
// import UserModel from '~/models/User.model'
function searchInRedis(_x, _x2) {
  return _searchInRedis.apply(this, arguments);
}
function _searchInRedis() {
  _searchInRedis = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(type, query) {
    var cacheKey, cachedResults;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          cacheKey = "search:".concat(type, ":").concat(query);
          _context6.next = 1;
          return _redis.redisClient.get(cacheKey);
        case 1:
          cachedResults = _context6.sent;
          if (!cachedResults) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", JSON.parse(cachedResults));
        case 2:
          return _context6.abrupt("return", null);
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _searchInRedis.apply(this, arguments);
}
function cacheInRedis(_x3, _x4, _x5) {
  return _cacheInRedis.apply(this, arguments);
}
function _cacheInRedis() {
  _cacheInRedis = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7(type, query, results) {
    var cacheKey;
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          cacheKey = "search:".concat(type, ":").concat(query);
          _context7.next = 1;
          return _redis.redisClient.set(cacheKey, JSON.stringify(results));
        case 1:
          _context7.next = 2;
          return _redis.redisClient.expire(cacheKey, 3 * 3600);
        case 2:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return _cacheInRedis.apply(this, arguments);
}
var searchProducts = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(query) {
    var page,
      limit,
      skip,
      cachedResults,
      regex,
      products,
      _args = arguments;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          page = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
          limit = _args.length > 2 && _args[2] !== undefined ? _args[2] : 10;
          skip = (page - 1) * limit;
          _context.next = 1;
          return searchInRedis('products', query);
        case 1:
          cachedResults = _context.sent;
          if (!cachedResults) {
            _context.next = 2;
            break;
          }
          return _context.abrupt("return", cachedResults);
        case 2:
          regex = new RegExp(".*".concat(query, ".*"), 'i');
          _context.next = 3;
          return _Product["default"].find({
            $or: [{
              name: regex
            }, {
              tags: regex
            }, {
              brand: regex
            }]
          }).skip(skip).limit(limit);
        case 3:
          products = _context.sent;
          _context.next = 4;
          return cacheInRedis('products', query, products);
        case 4:
          return _context.abrupt("return", products);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function searchProducts(_x6) {
    return _ref.apply(this, arguments);
  };
}();
var searchCategories = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(query) {
    var page,
      limit,
      skip,
      cachedResults,
      regex,
      categories,
      _args2 = arguments;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          page = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 1;
          limit = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 10;
          skip = (page - 1) * limit;
          _context2.next = 1;
          return searchInRedis('categories', query);
        case 1:
          cachedResults = _context2.sent;
          if (!cachedResults) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return", cachedResults);
        case 2:
          regex = new RegExp(".*".concat(query, ".*"), 'i');
          _context2.next = 3;
          return _Category["default"].find({
            $or: [{
              name: regex
            }, {
              description: regex
            }]
          }).skip(skip).limit(limit);
        case 3:
          categories = _context2.sent;
          _context2.next = 4;
          return cacheInRedis('categories', query, categories);
        case 4:
          return _context2.abrupt("return", categories);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function searchCategories(_x7) {
    return _ref2.apply(this, arguments);
  };
}();
var searchServices = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(query) {
    var page,
      limit,
      skip,
      cachedResults,
      regex,
      services,
      _args3 = arguments;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          page = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 1;
          limit = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : 10;
          skip = (page - 1) * limit;
          _context3.next = 1;
          return searchInRedis('services', query);
        case 1:
          cachedResults = _context3.sent;
          if (!cachedResults) {
            _context3.next = 2;
            break;
          }
          return _context3.abrupt("return", cachedResults);
        case 2:
          regex = new RegExp(".*".concat(query, ".*"), 'i');
          _context3.next = 3;
          return _Service["default"].find({
            $or: [{
              name: regex
            }, {
              description: regex
            }]
          }).skip(skip).limit(limit);
        case 3:
          services = _context3.sent;
          _context3.next = 4;
          return cacheInRedis('services', query, services);
        case 4:
          return _context3.abrupt("return", services);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function searchServices(_x8) {
    return _ref3.apply(this, arguments);
  };
}();
var searchServiceCategories = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4(query) {
    var page,
      limit,
      skip,
      cachedResults,
      regex,
      categories,
      _args4 = arguments;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          page = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 1;
          limit = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : 10;
          skip = (page - 1) * limit;
          _context4.next = 1;
          return searchInRedis('service_categories', query);
        case 1:
          cachedResults = _context4.sent;
          if (!cachedResults) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return", cachedResults);
        case 2:
          regex = new RegExp(".*".concat(query, ".*"), 'i');
          _context4.next = 3;
          return _ServiceCategory["default"].find({
            $or: [{
              name: regex
            }, {
              description: regex
            }]
          }).skip(skip).limit(limit);
        case 3:
          categories = _context4.sent;
          _context4.next = 4;
          return cacheInRedis('service_categories', query, categories);
        case 4:
          return _context4.abrupt("return", categories);
        case 5:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function searchServiceCategories(_x9) {
    return _ref4.apply(this, arguments);
  };
}();

// const searchUsers = async (query, page = 1, limit = 10) => {
//   const skip = (page - 1) * limit
//   const cachedResults = await searchInRedis('users', query);
//   if (cachedResults) {
//     return cachedResults;
//   }

//   const regex = new RegExp(`.*${query}.*`, 'i')
//   const users = await UserModel.find({
//     $or: [
//       { name: regex },
//       { email: regex },
//       { phone: regex }
//     ]
//   }).skip(skip).limit(limit)
//   await cacheInRedis('users', query, users);
//   return users
// }

var searchRequests = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(query) {
    var page,
      limit,
      skip,
      regex,
      repair,
      order,
      _args5 = arguments;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          page = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 1;
          limit = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : 10;
          skip = (page - 1) * limit;
          regex = new RegExp(".*".concat(query, ".*"), 'i');
          _context5.next = 1;
          return _RepairRequestModel["default"].find({
            $or: [{
              name: regex
            }, {
              email: regex
            }, {
              phone: regex
            }, {
              address: regex
            }, {
              problem_description: regex
            }]
          }).skip(skip).limit(limit);
        case 1:
          repair = _context5.sent;
          _context5.next = 2;
          return _OrderRequestModel["default"].find({
            $or: [{
              name: regex
            }, {
              email: regex
            }, {
              phone: regex
            }, {
              address: regex
            }, {
              note: regex
            }]
          }).skip(skip).limit(limit);
        case 2:
          order = _context5.sent;
          return _context5.abrupt("return", {
            repair: repair,
            order: order
          });
        case 3:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function searchRequests(_x0) {
    return _ref5.apply(this, arguments);
  };
}();
var searchService = exports.searchService = {
  searchProducts: searchProducts,
  searchCategories: searchCategories,
  searchServices: searchServices,
  searchServiceCategories: searchServiceCategories,
  searchRequests: searchRequests
};