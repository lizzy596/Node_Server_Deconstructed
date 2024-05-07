const express = require('express');
const taskController = require('./task.controller');
const taskValidation = require('./task.validation');
const validate = require('../../config/middlewares/validate');

const router = express.Router();

router
  .route('/')
  .post(validate(taskValidation.createTask), taskController.createTask)
  .get( taskController.getTasks);

router
  .route('/:taskId')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;