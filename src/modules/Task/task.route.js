const express = require('express');
const taskController = require('./task.controller');

const router = express.Router();

router
  .route('/')
  .post(taskController.createTask)
  .get( taskController.getTasks);

router
  .route('/:taskId')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;