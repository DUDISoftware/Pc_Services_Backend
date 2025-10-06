"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repairService = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _ApiError = _interopRequireDefault(require("../utils/ApiError"));
var _httpStatusCodes = require("http-status-codes");
var _RepairRequestModel = _interopRequireDefault(require("../models/RepairRequest.model.js"));
var _cloudinary = require("../utils/cloudinary.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var createRequest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(reqBody, files) {
    var requestData, newRequest;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          requestData = _objectSpread(_objectSpread({}, reqBody), {}, {
            images: (files === null || files === void 0 ? void 0 : files.map(function (file) {
              return {
                url: file.path,
                public_id: file.filename
              };
            })) || []
          });
          newRequest = new _RepairRequestModel["default"](requestData);
          _context.next = 1;
          return newRequest.save();
        case 1:
          return _context.abrupt("return", newRequest);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var updateRequest = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(id, reqBody, files) {
    var updateData, updated;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          updateData = _objectSpread(_objectSpread({}, reqBody), {}, {
            updatedAt: Date.now()
          });
          if (files && files.length > 0) {
            updateData.images = files.map(function (file) {
              return {
                url: file.path,
                public_id: file.filename
              };
            });
          }
          _context2.next = 1;
          return _RepairRequestModel["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          });
        case 1:
          updated = _context2.sent;
          if (updated) {
            _context2.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          return _context2.abrupt("return", updated);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateRequest(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var hideRequest = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
    var updateData, updated;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          updateData = {
            hidden: true,
            updatedAt: Date.now()
          };
          _context3.next = 1;
          return _RepairRequestModel["default"].findByIdAndUpdate(id, updateData, {
            "new": true
          });
        case 1:
          updated = _context3.sent;
          if (updated) {
            _context3.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          return _context3.abrupt("return", updated);
        case 3:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function hideRequest(_x6) {
    return _ref3.apply(this, arguments);
  };
}();
var getAllRequests = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var page,
      limit,
      skip,
      requests,
      _args4 = arguments;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          page = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : 1;
          limit = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 10;
          skip = (page - 1) * limit;
          _context4.next = 1;
          return _RepairRequestModel["default"].find().skip(skip).limit(limit).sort({
            createdAt: -1
          });
        case 1:
          requests = _context4.sent;
          return _context4.abrupt("return", requests);
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getAllRequests() {
    return _ref4.apply(this, arguments);
  };
}();
var getRequestById = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(id) {
    var request;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 1;
          return _RepairRequestModel["default"].findById(id);
        case 1:
          request = _context5.sent;
          return _context5.abrupt("return", request);
        case 2:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function getRequestById(_x7) {
    return _ref5.apply(this, arguments);
  };
}();
var deleteRequest = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
    var result;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return _RepairRequestModel["default"].findByIdAndDelete(id);
        case 1:
          result = _context6.sent;
          if (result) {
            _context6.next = 2;
            break;
          }
          throw new _ApiError["default"](_httpStatusCodes.StatusCodes.NOT_FOUND, 'Request not found');
        case 2:
          if (!(result.images && result.images.length > 0)) {
            _context6.next = 3;
            break;
          }
          _context6.next = 3;
          return Promise.all(result.images.map(function (image) {
            return (0, _cloudinary.deleteImage)(image.public_id);
          }));
        case 3:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function deleteRequest(_x8) {
    return _ref6.apply(this, arguments);
  };
}();
var repairService = exports.repairService = {
  createRequest: createRequest,
  updateRequest: updateRequest,
  hideRequest: hideRequest,
  getRequestById: getRequestById,
  getAllRequests: getAllRequests,
  deleteRequest: deleteRequest
};