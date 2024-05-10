const ClientError = require('../error/ClientError');
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const config = {env: 'development'};

//Converts mongoose errors to client errors, you must also pass the err to next, so that
//any errors that are not mongoose.errors are still passed down the chain.

const errorConverter = (err, req, res, next) => {
  if(err) {
  if (err instanceof mongoose.Error) {
    throw ClientError.BadRequest('Invalid field input')
} else {
  next(err)
}} 
}

//returns either a client error or a general error
const errorHandler = (err, req, res, next) => {
  const response = {
    code: err.code || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.code ? err.message : 'Something went wrong, please try again later.',
    stack: config.env === 'development' ? err.stack : null
  }
 return res.status(response.code).send(response)
}






module.exports = { errorHandler, errorConverter }