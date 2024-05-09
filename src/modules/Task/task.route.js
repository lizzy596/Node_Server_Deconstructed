const express = require('express');
const taskController = require('./task.controller');
const taskValidation = require('./task.validation');
const validateRequest = require('../../config/middlewares/validateRequest');

const router = express.Router();

router
  .route('/')
  .post(validateRequest(taskValidation.createTask), taskController.createTask)
  .get( taskController.getTasks);

router
  .route('/:taskId')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;