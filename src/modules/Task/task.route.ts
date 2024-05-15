import express from "express";
import * as taskController from "./task.controller.js";
import * as taskValidation from "./task.validation.js";
import validateInput from "../../config/middlewares/validateInput.js";

const router = express.Router();

router
  .route("/")
  .post(validateInput(taskValidation.createTask), taskController.createTask)
  .get(taskController.getTasks);

router
  .route("/:taskId")
  .get(taskController.getTask)
  .patch(validateInput(taskValidation.updateTask), taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;

