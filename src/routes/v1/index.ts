import express, { Router } from 'express';
import taskRoute from '../../modules/Task/task.route.js'
import config from 'config/config.js';

const router: Router = express.Router();

const defaultRoutes: { path: string; route: Router }[] = [
  {
    path: '/tasks',
    route: taskRoute,
  }
];

const devRoutes: { path: string; route: Router }[] = [
  // routes available only in development mode
  // {
  //   path: '/docs',
  //   route: docsRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
