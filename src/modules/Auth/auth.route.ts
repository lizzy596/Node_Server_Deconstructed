import express from "express";
import * as authController from "./auth.controller.js";
import * as authValidation from "./auth.validation.js";
import validateInput from "../../config/middlewares/validateInput.js";

const router = express.Router();

router
  .route("/register")
  .post(validateInput(authValidation.register), authController.register);
router
  .route("/login")
  .post(validateInput(authValidation.login), authController.login);
router
  .route("/logout/:userId")
  .post(validateInput(authValidation.login), authController.login)
 

export default router;