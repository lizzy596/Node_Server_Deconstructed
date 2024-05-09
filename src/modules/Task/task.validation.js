const { number, object, optional, string } = require('superstruct');




const createTask = object({
  title: string(),
  description: optional(string()),
})
















module.exports = {createTask}






// const Joi = require('joi');


// const createTask = Joi.object({
//   body: {
//   title: Joi.number().required()
//   }
// })






// module.exports.taskValidation = {createTask};