const { define } = require('superstruct');


function isEmail(input: string): boolean | string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? true : "a valid email address";
}

function isValidMongo(input: string): boolean | { message: string } {
  const mongoRegex = /^[0-9a-fA-F]{24}$/;
  return mongoRegex.test(input) ? true : { message: "a valid mongo Id" };
}

const Email = define("Email", isEmail);
const MongoId = define("MongoId", isValidMongo);

export { Email, MongoId };

