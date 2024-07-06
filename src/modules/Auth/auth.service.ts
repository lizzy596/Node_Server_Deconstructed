import {IUser } from 'modules/User/user.model.js';
import httpStatus from 'http-status';
import ClientError from '../../config/error/ClientError.js';
import * as sessionService from './Session/session.service.js';
import Session from './Session/session.model.js';
import * as userService from '../User/user.service.js'
import { verifyJWT, generateAuthTokens, IAuthTokens } from './utils/jwt.util.js';



interface IRefreshedAuth {
  user: IUser;
  tokens: IAuthTokens
}


export const login = async (email: string, password: string): Promise<IUser> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ClientError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export const refreshAuth = async (token: string): Promise <IRefreshedAuth> => {
  try {
  const payload = await verifyJWT(token);
  if(!payload) {
    throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  if(!payload.sub || typeof payload.sub !== 'string') {
      throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    const user = await userService.getUserById(payload.sub);
    if(!user) {
      throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  const session = await sessionService.getSessionRecordByUserId(payload?.sub);
    if(!session) {
      throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
    await sessionService.deleteSessionRecordsByUserId(payload.sub);
    const tokens = await generateAuthTokens(payload.sub);
    return { user, tokens };
 } catch (error) {
  console.error(error)
  throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
 }


}

export const logout = async (refreshToken:string) => {
  if (!refreshToken) return;
  const sessionDoc = await Session.findOne({ token: refreshToken, valid: true, tokenType: 'refresh' });
  if (!sessionDoc) return;
  return sessionService.deleteSessionRecordsByUserId(sessionDoc.user);
};




