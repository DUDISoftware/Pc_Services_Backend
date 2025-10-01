"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodemailerTransporter = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _environment = require("./environment.js");
var nodemailerTransporter = exports.nodemailerTransporter = _nodemailer["default"].createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  // Use TLS
  auth: {
    user: _environment.env.EMAIL_USER,
    pass: _environment.env.EMAIL_PASS
  }
});