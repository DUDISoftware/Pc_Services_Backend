"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _db = require("./config/db.js");
var _redis = require("./config/redis.js");
var _environment = require("./config/environment.js");
var _index = require("./routes/index.js");
var _errorMiddleware = require("./middlewares/error.middleware.js");
var _bodyParser = _interopRequireDefault(require("body-parser"));
/* eslint-disable no-console */

var APP_HOST = _environment.env.APP_HOST || 'localhost';
var APP_PORT = _environment.env.APP_PORT || 5000;
var START_SERVER = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var app, cors;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          app = (0, _express["default"])();
          cors = require('cors');
          app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true
          }));
          app.use(_bodyParser["default"].urlencoded({
            extended: false
          }));
          app.use(_express["default"].json());
          app.use(_express["default"].urlencoded({
            extended: true
          }));
          app.use('/api', _index.APIs);
          app.use(_errorMiddleware.errorHandler);
          app.listen(APP_PORT, APP_HOST, function () {
            console.log("\uD83D\uDE80 Server running at http://".concat(APP_HOST, ":").concat(APP_PORT));
          });
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function START_SERVER() {
    return _ref.apply(this, arguments);
  };
}();
(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        console.log('Connecting to database...');
        _context2.next = 1;
        return (0, _db.CONNECT_DB)();
      case 1:
        console.log('Database connected successfully');
        console.log('Connecting to Redis');
        _context2.next = 2;
        return (0, _redis.CONNECT_REDIS)();
      case 2:
        console.log('Redis connected');
        console.log('Starting server...');
        _context2.next = 3;
        return START_SERVER();
      case 3:
      case "end":
        return _context2.stop();
    }
  }, _callee2);
}))();