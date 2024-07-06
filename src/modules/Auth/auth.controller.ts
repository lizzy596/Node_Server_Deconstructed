import { Request, Response } from 'express';
import config from '../../config/config.js';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';
import { setCookieToken, clearCookieToken } from './utils/cookie.util.js';
import { generateAuthTokens } from './utils/jwt.util.js';


const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body)
  res.cookie("userId", user.id, { maxAge: 90000000 });
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  if(!user) { 
    throw ClientError.Unauthorized("Invalid credentials");
  }
  const tokens = await generateAuthTokens(user._id)
  await setCookieToken(res, tokens.refreshToken)
  res.send({ user, tokens });
  });

const refreshAuthTokens = catchAsync(async (req: Request, res: Response) => {
const refreshed = await authService.refreshAuth(req.cookies.refreshToken);
setCookieToken(res, refreshed?.tokens?.refreshToken); 
res.send(refreshed);
});

const logout = catchAsync(async (req:Request, res:Response) => {
  const token = await authService.logout(req.cookies[config.jwt.refreshCookieName] || req.body?.refreshToken);
  if (!token) {
    throw new ClientError(httpStatus.NOT_FOUND, 'No token found');
  }
  clearCookieToken(res);
  res.status(httpStatus.NO_CONTENT).send();
});

const revokeAuthSession = catchAsync(async (_req: Request, _res: Response) => {

})



export {
  register,
  login,
  refreshAuthTokens,
  logout,
  revokeAuthSession
};