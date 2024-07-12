import express from "express";
import * as authController from "./auth.controller.js";
import * as authValidation from "./auth.validation.js";
import validateInput from "../../config/middlewares/validateInput.js";

const router = express.Router();

router
  .route("/register")
  //.post(validateInput(authValidation.register), authController.register);
  .post(authController.register);
router
  .route("/login")
  //.post(validateInput(authValidation.login), authController.login);
  .post( authController.login);
  router
  .route("/refresh-tokens")
  .post(authController.refreshAuthTokens)
  router
  .route("/verify-email")
  .post(authController.verifyEmail)
router
  .route("/logout")
  .post(validateInput(authValidation.logout), authController.logout)
 

export default router;