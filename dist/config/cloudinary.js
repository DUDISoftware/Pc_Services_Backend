"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "cloudinary", {
  enumerable: true,
  get: function get() {
    return _cloudinary.v2;
  }
});
var _environment = require("./environment");
var _cloudinary = require("cloudinary");
_cloudinary.v2.config({
  cloud_name: _environment.env.CLOUDINARY_CLOUD_NAME,
  api_key: _environment.env.CLOUDINARY_API_KEY,
  api_secret: _environment.env.CLOUDINARY_API_SECRET
});