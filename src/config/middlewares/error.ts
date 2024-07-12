import { Request, Response, NextFunction } from 'express';
import ClientError from '../error/ClientError.js';
import httpStatus from 'http-status';
import config from '../config.js';



//This will catch certain mongoose errors and then present a given message to the client application 

const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  if (err.name === 'MongoServerError' && err.code === 11000) {
     throw ClientError.BadRequest( `Duplicate value entered for form field, please choose another value`);
     }
     if (err.name === 'ValidationError' || err.name === 'CastError') {
      throw ClientError.BadRequest('Invalid data type for entry, please choose another value');
    } 
  next(err);
};

// Returns either a client error or a more general error
const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const response = {
    code: err.code || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.code
      ? err.message
      : "Something went wrong, please try again later.",
    stack: config.env === "development" ? err.stack : null,
  };
  return res.status(response.code).send(response);
};

export { errorHandler, errorConverter };

