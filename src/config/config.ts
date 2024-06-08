import { enums, defaulted, validate, object, string} from 'superstruct';
import path from 'path';
import dotenv from 'dotenv';

const envVars = dotenv.config({ path: path.join(__dirname, '../../.env') });


const envVarsSchema = object({
    NODE_ENV: enums(['production', 'development', 'test']),
    PORT: defaulted(string(), '3010'),
    MONGODB_URL: string(),
  });

const [error, value] = validate(envVars.parsed, envVarsSchema);

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
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
 };

export default config;