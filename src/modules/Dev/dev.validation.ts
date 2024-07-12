import { boolean, object, optional, string} from 'superstruct';
import { MongoId } from "../../config/validators/custom.validators.js";

export const createDev = object({
  body: object(
    { 
      unique: optional(string()), 
      mismatch: boolean(),
      searchTerm: optional(string()),
    }),
 
});

export const getDev = object({
  params: object({ devId: MongoId }),
});

export const updateDev = object({
  params: object({ taskId: MongoId }),
  body: object({
    unique: optional(string()), 
    mismatch: optional(boolean()),
    searchTerm: optional(string()),
  }),
});

export const deleteDev = object({
  params: object({ devId: MongoId }),
});