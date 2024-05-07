const ClientError = require('../error/ClientError');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { z } = require('zod');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.code).json({ msg: err.message })
  }
  // if (err instanceof z.ZodError) {
  //   return res.status(httpStatus.BAD_REQUEST).json({ msg: err.message })
  // }
  if (err instanceof mongoose.Error) {
    return res.status(httpStatus.NOT_IMPLEMENTED).json({ msg: err.message })
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong try again later')
}


const errorConverter = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    console.log('ZOD ERROR:', err.errors[0].message)
    // throw ClientError.BadRequest('No task found');
    return res.status(httpStatus.BAD_REQUEST).json({ msg: err.message })
  }
}

module.exports = { errorHandler, errorConverter }