const express = require('express');
const taskController = require('./task.controller');
const taskValidation = require('./task.validation');
const validateInput = require('../../config/middlewares/validateInput');

const router = express.Router();

router
  .route('/')
  .post(validateInput(taskValidation.createTask), taskController.createTask)
  //.post(taskController.createTask)
  .get( taskController.getTasks);

router
  .route('/:taskId')
  .get(validateInput(taskValidation.getTask), taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;