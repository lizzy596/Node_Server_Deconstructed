import express from 'express';
import * as devController from './dev.controller.js'


const router = express.Router();

router.route('/').get(devController.dev);
router.route('/pb').post(devController.dev);

export default router;