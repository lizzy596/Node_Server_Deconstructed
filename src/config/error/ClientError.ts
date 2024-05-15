import httpStatus from 'http-status';

class ClientError extends Error {
  code: number;

  constructor(code: number, message: string, stack = "") {
    super(message);
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static BadRequest(msg: string): ClientError {
    return new ClientError(httpStatus.BAD_REQUEST, msg);
  }

  static Unauthorized(msg: string): ClientError {
    return new ClientError(httpStatus.UNAUTHORIZED, msg);
  }

  static Forbidden(msg: string): ClientError {
    return new ClientError(httpStatus.FORBIDDEN, msg);
  }

  static NotFound(msg: string): ClientError {
    return new ClientError(httpStatus.NOT_FOUND, msg);
  }
}

export default ClientError;

