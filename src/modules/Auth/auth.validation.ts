import { object, optional, string} from 'superstruct';
import { Email, MongoId } from "../../config/validators/custom.validators.js";

export const register = object({
  body: object({
   name: string(),
   email: Email,
   password: string(),
   role: optional(string()),
 }) 
 });

export const login = object({
  body: object({ email: Email, password: string() }),
});

export const logout = object({
  params: object({ taskId: MongoId }),
});

