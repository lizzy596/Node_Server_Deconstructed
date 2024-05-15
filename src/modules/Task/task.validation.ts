const { boolean, object, enums, optional, string} = require('superstruct');

import { MongoId } from "../../config/validators/custom.validators.js";

export const createTask = object({
  priority: optional(enums(["HIGH", "LOW", "MEDIUM"])),
  note: string(),
  reminder: optional(boolean()),
});

export const getTask = object({
  params: object({ taskId: MongoId }),
});

export const updateTask = object({
  params: object({ taskId: MongoId }),
  body: object({
    priority: optional(enums(["HIGH", "LOW", "MEDIUM"])),
    note: optional(string()),
    reminder: optional(boolean()),
  }),
});

export const deleteTask = object({
  params: object({ taskId: MongoId }),
});

