import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.js';
import ClientError from '../../config/error/ClientError.js';
// import pick from '../../config/utils/pick.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';
import { generateJWT } from '../../config/utils/jwt.js';
import config from '../../config/config.js'

const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body)
  res.cookie("userId", user.id, { maxAge: 90000000 });
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  if(user) {
  const accessToken = generateJWT({userId: user._id, tokenType: 'access'}, parseInt(config.jwt.accessTokenExpiration));
  const refreshToken = generateJWT({userId: user._id, tokenType: 'refresh'}, parseInt(config.jwt.refreshTokenExpiration));
  const tokens = { accessToken: accessToken, refreshToken: refreshToken}
  //res.cookie("refreshToken", tokens.refreshToken, {secure: true, httpOnly: true expires:});
  res.send({ user, tokens });
  } else {
    throw ClientError.Unauthorized("Invalid credentials")
}

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