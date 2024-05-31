import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.js';
// import ClientError from '../../config/error/ClientError.js';
// import pick from '../../config/utils/pick.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body)
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  res.cookie("userId", user.id, { maxAge: 90000000 });
  res.send({ user });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body)
  res.send('hey');

});



export {
  register,
  login,
  logout
};