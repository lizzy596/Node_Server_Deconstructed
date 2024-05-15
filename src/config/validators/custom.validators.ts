import {
  Struct,
  define
} from 'superstruct';


function isEmail(input: any): boolean | string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? true : "a valid email address";
}

function isValidMongo(input: any): boolean | { message: string } {
  const mongoRegex = /^[0-9a-fA-F]{24}$/;
  return mongoRegex.test(input) ? true : { message: "a valid mongo Id" };
}

const Email: Struct<string> = define<string>("Email", isEmail);
const MongoId: Struct<string> = define<string>("MongoId", isValidMongo);

export { Email, MongoId };

