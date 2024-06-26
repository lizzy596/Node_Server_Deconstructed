import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
import { setCookieToken } from './utils/cookie.util.js';
import { verifyJWT } from './utils/jwt.util.js';
// import pick from '../../config/utils/pick.js';
import * as authService from './auth.service.js'
import * as userService from '../User/user.service.js';
import * as sessionService from './Session/session.service.js';
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
const payload = await verifyJWT(req.cookies.refreshToken)
console.log('payload', payload)
if(payload.sub && typeof payload.sub === 'string') {
await sessionService.deleteSessionRecordsByUserId(payload.sub);
const user = userService.getUserById(payload.sub);
const tokens = await generateAuthTokens(payload.sub);
setCookieToken(res, tokens.refreshToken); 
res.send({ user, tokens });
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
  refreshAuthTokens,
  logout
};