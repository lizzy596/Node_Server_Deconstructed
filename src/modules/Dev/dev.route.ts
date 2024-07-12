import express from "express";
import * as devController from "./dev.controller.js";
import * as devValidation from "./dev.validation.js";
import validateInput from "../../config/middlewares/validateInput.js";



const router = express.Router();

router
  .route("/")
  .post(devController.createDev)
  .get(devController.getDevs);

router
  .route("/:devId")
  .get(devController.getDev)
  .patch(validateInput(devValidation.updateDev), devController.updateDev)
  .delete(devController.deleteDev);

export default router;