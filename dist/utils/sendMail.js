"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _nodemailer = require("../config/nodemailer.js");
var _environment = require("../config/environment.js");
var sendMail = function sendMail(to, subject, text) {
  try {
    var mailOptions = {
      from: _environment.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text
    };
    return _nodemailer.nodemailerTransporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email');
  }
};
var _default = exports["default"] = sendMail;