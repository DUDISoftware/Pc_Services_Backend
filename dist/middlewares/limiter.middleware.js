"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRateLimiter = exports.loginRateLimiter = exports.createRateLimiter = void 0;
var _expressRateLimit = require("express-rate-limit");
var createRateLimiter = exports.createRateLimiter = function createRateLimiter(_ref) {
  var maxRequests = _ref.maxRequests,
    windowMs = _ref.windowMs,
    _ref$message = _ref.message,
    message = _ref$message === void 0 ? 'Too many requests, please try again later.' : _ref$message;
  return (0, _expressRateLimit.rateLimit)({
    windowMs: windowMs,
    // Time window in milliseconds
    limit: maxRequests,
    // Maximum number of requests allowed within the time window
    standardHeaders: true,
    // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
    // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56,
    message: {
      statusCode: 429,
      message: message
    }
  });
};

// 5 requests per 5 minutes
var loginRateLimiter = exports.loginRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 5 * 60 * 1000,
  message: 'Too many login attempts, please try again later.'
});

// 10 requests per hour
var registerRateLimiter = exports.registerRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Too many registration attempts, please try again later.'
});