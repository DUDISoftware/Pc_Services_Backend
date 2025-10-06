"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = void 0;
/* eslint-disable no-console */
var errorHandler = exports.errorHandler = function errorHandler(err, req, res, next) {
  console.error('error in handle', err);
  if (err.statusCode) {
    res.status(err.statusCode).json({
      message: err.message
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong!'
    });
  }
};