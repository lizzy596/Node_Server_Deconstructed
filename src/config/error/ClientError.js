const httpStatus = require('http-status');

class ClientError extends Error {
  constructor(code, message, stack='') {
    super(message);
    this.code = code;
    this.message = message;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  static BadRequest(msg) {
    return new ClientError(httpStatus.BAD_REQUEST, msg);
  }
  static Unauthorized(msg) {
    return new ClientError(httpStatus.UNAUTHORIZED, msg);
  }
  static Forbidden(msg) {
    return new ClientError(httpStatus.FORBIDDEN, msg);
  }
  static NotFound(msg) {
    return new ClientError(httpStatus.NOT_FOUND, msg);
  }
}

module.exports = ClientError;