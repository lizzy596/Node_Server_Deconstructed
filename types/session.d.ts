
import { MongoId } from "../src/config/validators/custom.validators.js";

declare module 'express-session' {
  interface SessionData {
      user: string;
  }
}
export default 'express-session';