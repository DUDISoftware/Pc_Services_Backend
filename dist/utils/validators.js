"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PHONE_RULE_MESSAGE = exports.PHONE_RULE = exports.OBJECT_ID_RULE_MESSAGE = exports.OBJECT_ID_RULE = void 0;
var OBJECT_ID_RULE = exports.OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
var OBJECT_ID_RULE_MESSAGE = exports.OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!';
var PHONE_RULE = exports.PHONE_RULE = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
var PHONE_RULE_MESSAGE = exports.PHONE_RULE_MESSAGE = 'Must enter a vietnamese phone number!';