import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as userService from './user.service.js';
import catchAsync from '../../config/utils/catchAsync.js';
import ClientError from '../../config/error/ClientError.js';
import pick from '../../config/utils/pick.js';

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId!);
  if (!user) {
    throw ClientError.BadRequest("User not found");
  }
  res.send(user);
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const { search } = pick(req.query, ["search"]);
  const result = await userService.queryUsers(filter, options, search);
  res.send(result);
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.userId!, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.userId!);
  res.status(httpStatus.NO_CONTENT).send();
});

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};