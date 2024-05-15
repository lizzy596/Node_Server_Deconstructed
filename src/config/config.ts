import {
  enums,
  defaulted,
  object,
  number,
  string,
  validate,
}  from "superstruct";
import 'dotenv/config';

const envVarsSchema = object({
    NODE_ENV: enums(['production', 'development', 'test']),
    PORT: defaulted(number(), 3010),
    MONGODB_URL: string(),
  });

const [error, value] = validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: value.NODE_ENV,
  port: value.PORT,
  mongoose: {
    url: value.MONGODB_URL + (value.NODE_ENV === 'test' ? '-test' : ''),
    options: {}
  },
 };

export default config;