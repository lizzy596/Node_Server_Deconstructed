import { Request, Response, NextFunction } from 'express';
import ClientError from '../error/ClientError.js';
import httpStatus from 'http-status';
//import mongoose from 'mongoose';

const config = { env: "development" };

// Converts mongoose errors to client errors
// You must also pass the err to next, so that any errors that are not mongoose.errors are still passed down the chain.
// const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
//   if (err) {
//     if (err instanceof mongoose.Error) {
//       throw new ClientError(httpStatus.BAD_REQUEST, "Invalid field input");
//     } else {
//       next(err);
//     }
//   }
// };

const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  console.log('error converter:',err)
  if (err.code && err.code === 11000) {
     throw ClientError.BadRequest( `Duplicate value entered for form field, please choose another value`);
    
  }
  if (err.name === 'CastError') {
    throw ClientError.BadRequest('Item not found');
  } 
  next(err);
};

// Returns either a client error or a general error
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

