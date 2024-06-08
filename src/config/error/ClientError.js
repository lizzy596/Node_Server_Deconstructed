"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_1 = require("http-status");
var ClientError = /** @class */ (function (_super) {
    __extends(ClientError, _super);
    function ClientError(code, message, stack) {
        if (stack === void 0) { stack = ""; }
        var _this = _super.call(this, message) || this;
        _this.code = code;
        if (stack) {
            _this.stack = stack;
        }
        else {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    ClientError.BadRequest = function (msg) {
        return new ClientError(http_status_1.default.BAD_REQUEST, msg);
    };
    ClientError.Unauthorized = function (msg) {
        return new ClientError(http_status_1.default.UNAUTHORIZED, msg);
    };
    ClientError.Forbidden = function (msg) {
        return new ClientError(http_status_1.default.FORBIDDEN, msg);
    };
    ClientError.NotFound = function (msg) {
        return new ClientError(http_status_1.default.NOT_FOUND, msg);
    };
    return ClientError;
}(Error));
exports.default = ClientError;
