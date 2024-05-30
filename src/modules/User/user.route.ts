import express from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import validateInput from "../../config/middlewares/validateInput.js";

const router = express.Router();

router
  .route("/")
  .post(validateInput(userValidation.createUser), userController.createUser)
  .get(userController.getUsers);

router
  .route("/:userId")
  .get(userController.getUser)
  .patch(validateInput(userValidation.updateUser), userController.updateUser)
  .delete(userController.deleteUser);

export default router;