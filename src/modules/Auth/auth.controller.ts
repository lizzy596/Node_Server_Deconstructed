import { Request, Response } from 'express';
import config from '../../config/config.js';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';
import * as emailHelper from './helpers/email.helper.js';
import { setCookieToken, clearCookieToken } from './helpers/cookie.helper.js';
import { generateAuthTokens, generateEmailVerificationToken } from './helpers/jwt.helper.js';


const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  const token = await generateEmailVerificationToken(user.id)
  await emailHelper.sendVerificationEmail(user.email, token, user.name)
  res.status(httpStatus.NO_CONTENT).send();
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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  if(!token) return;
  try {
    await authService.verifyEmail(token);
  } catch (err) {
    throw ClientError.BadRequest('Invalid credentials');
  }
  res.status(httpStatus.OK).send();
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.sendForgotPasswordEmail(email);
  res.status(httpStatus.OK).send();
});

const resetUserPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetUserPassword(token, newPassword);
  res.status(httpStatus.OK).send();
});




export {
  register,
  login,
  refreshAuthTokens,
  logout,
  revokeAuthSession,
  verifyEmail,
  forgotPassword,
  resetUserPassword,

};