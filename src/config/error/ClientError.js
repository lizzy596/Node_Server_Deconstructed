const httpStatus = require('http-status');

class ClientError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
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
}

module.exports = ClientError;