const { boolean, enums, object, optional, string, pattern } = require('superstruct');
const {validMongoId } = require('../../config/validators/custom.validators');



const createTask =
 object({
  priority: optional(enums(['HIGH', 'LOW', 'MEDIUM'])),
  note: string(),
  reminder: optional(boolean())
});

const getTask = 
   object({
    taskId: validMongoId()
  });

const updateTask = object({});

const deleteTask = object({});












module.exports = {createTask, getTask, updateTask, deleteTask}






// const Joi = require('joi');


// const createTask = Joi.object({
//   body: {
//   title: Joi.number().required()
//   }
// })






// module.exports.taskValidation = {createTask};