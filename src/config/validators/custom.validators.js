const { pattern, string, refine, object, define, number} = require('superstruct');

const mongoRegex = /^[0-9a-fA-F]{24}$/;

function isEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? true: 'a valid email address';
}

function isValidMongo(input) {
  const mongoRegex = /^[0-9a-fA-F]{24}$/;
  return mongoRegex.test(input) ? true: {message: 'a valid mongo Id'};
}


const Email = define('Email', isEmail)
const MongoId = define('MongoId', isValidMongo)

module.exports = { Email, MongoId}
