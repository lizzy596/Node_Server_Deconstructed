import { object, optional, string} from 'superstruct';
import { Email, MongoId } from "../../config/validators/custom.validators.js";

export const createUser = object({
 body: object({
  name: string(),
  email: Email,
  password: string(),
  role: optional(string()),
}) 
});

export const getUser = object({
  params: object({ userId: MongoId }),
});

export const updateUser = object({
  params: object({ userId: MongoId }),
  body: object({
    name: optional(string()),
    email: optional(Email),
    password: optional(string()),
    role: optional(string()),
  }),
});

export const deleteUser = object({
  params: object({ userId: MongoId }),
});