const {z}  = require('zod');


const createTask = z.object({
  title: z.number({ message: "Title must be a number" }),
  description: z.string({ message: "Description must be a string"}).optional(),
})


module.exports = {createTask}






// const Joi = require('joi');


// const createTask = Joi.object({
//   body: {
//   title: Joi.number().required()
//   }
// })






// module.exports.taskValidation = {createTask};