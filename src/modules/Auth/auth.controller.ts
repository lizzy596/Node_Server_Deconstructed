import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
import { setCookieExpiration } from '../../config/utils/cookie.util.js';
// import pick from '../../config/utils/pick.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';
import { generateJWT } from '../../config/utils/jwt.util.js';
import config from '../../config/config.js'

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
  const accessToken = generateJWT({sub: user._id, tokenType: 'access'}, config.jwt.accessTokenExpiration);
  const refreshToken = generateJWT({sub: user._id, tokenType: 'refresh'}, config.jwt.refreshTokenExpiration);
  const tokens = { accessToken: accessToken, refreshToken: refreshToken}
const uni = setCookieExpiration(refreshToken);
const milli = uni * 1000;
const dateObj = new Date(milli);
console.log('human date', dateObj)
res.cookie("refreshToken", refreshToken, {secure: true, httpOnly: false, maxAge: milli, expires: dateObj});
  res.send({ user, tokens });
  });

const logout = catchAsync(async (req: Request, res: Response) => {
  //@ts-ignore
  req.session.destroy();
  res.send('hey');

});



export {
  register,
  login,
  logout
};