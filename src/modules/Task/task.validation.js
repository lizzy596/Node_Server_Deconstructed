const {
  boolean,
  enums,
  object,
  number,
  optional,
  string,
  pattern,
  validate,
} = require("superstruct");
const { MongoId } = require("../../config/validators/custom.validators");

const createTask = object({
  priority: optional(enums(["HIGH", "LOW", "MEDIUM"])),
  note: string(),
  reminder: optional(boolean()),
});

const getTask = object({
  params: object({ taskId: MongoId }),
});

const updateTask = object({
  params: object({ taskId: MongoId }),
  body: object({
    priority: optional(enums(["HIGH", "LOW", "MEDIUM"])),
    note: optional(string()),
    reminder: optional(boolean()),
  }),
});

const deleteTask = object({
  params: object({ taskId: MongoId }),
});

module.exports = { createTask, getTask, updateTask, deleteTask };

// const Joi = require('joi');

// const createTask = Joi.object({
//   body: {
//   title: Joi.number().required()
//   }
// })

// module.exports.taskValidation = {createTask};
