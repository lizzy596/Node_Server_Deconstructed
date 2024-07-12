import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as devService from './dev.service.js';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
//import pick from '../../config/utils/pick.js';



const getDev = catchAsync(async (req: Request, res: Response) => {
  const dev = await devService.getDevById(req.params.devId!);
  if (!dev) {
    throw ClientError.BadRequest("Dev not found");
  }
  res.send(dev);
});

const createDev = catchAsync(async (req: Request, res: Response) => {
  const dev = await devService.createDev(req.body);
  res.status(httpStatus.CREATED).send(dev);
});

const getDevs = catchAsync(async (req: Request, res: Response) => {
  const devs = await devService.queryDevs(req?.body?.searchProperty);
  res.send(devs);
});



const updateDev = catchAsync(async (req: Request, res: Response) => {
  const dev = await devService.updateDevById(req.params.devId!, req.body);
  res.send(dev);
});

const deleteDev = catchAsync(async (req: Request, res: Response) => {
  await devService.deleteDevById(req.params.devId!);
  res.status(httpStatus.NO_CONTENT).send();
});

export {
  createDev,
  getDevs,
  getDev,
  updateDev,
  deleteDev,
};
