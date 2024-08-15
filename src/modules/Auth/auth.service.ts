import {IUser } from 'modules/User/user.model.js';
import ClientError from '../../config/error/ClientError.js';
import Session from './Session/session.model.js';
import tokenTypes from './Session/token.types.js';
import * as sessionService from './Session/session.service.js';
import * as emailHelper from './helpers/email.helper.js';
import * as userService from '../User/user.service.js'
import { generateAuthTokens, verifyTokenAndSession, IAuthTokens, generatePasswordResetToken } from './helpers/jwt.helper.js';

interface IRefreshedAuth {
  user: IUser;
  tokens: IAuthTokens
}

const login = async (email: string, password: string): Promise<IUser> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw ClientError.Unauthorized('Incorrect email or password');
  }
  return user;
};


const refreshAuth = async (token: string): Promise <IRefreshedAuth> => {
  try {
    const user = await verifyTokenAndSession(token, tokenTypes.REFRESH)
    const tokens = await generateAuthTokens(user?._id);
    return { user, tokens };
 } catch (error) {
  throw ClientError.BadRequest('Please authenticate');
 }
}

const verifyEmail  = async (token:string) => {
    const user = await verifyTokenAndSession(token, tokenTypes.VERIFY_EMAIL)
    try {
          
      await userService.updateUserById(user.id, {isEmailVerified: true });
      await sessionService.deleteSessionRecordsByUserIdAndTokenType(user.id, tokenTypes.VERIFY_EMAIL);
       } catch(err) {
        throw ClientError.BadRequest('Please authenticate')
       }
  }




const logout = async (refreshToken:string) => {
  if (!refreshToken) return;
  const sessionDoc = await Session.findOne({ token: refreshToken, valid: true, tokenType: tokenTypes.REFRESH });
  if (!sessionDoc) return;
  return sessionService.deleteAllSessionRecordsByUserId(sessionDoc.user);
};




const sendForgotPasswordEmail = async (email: string) => {
const user = await userService.getUserByEmail(email);
if(user) {
  const token = await generatePasswordResetToken(user.id);
  await emailHelper.sendResetPasswordEmail(user.email, token);
  return;
}
};

const resetUserPassword = async (token:string, password: string) => {
  const user = await verifyTokenAndSession(token, tokenTypes.RESET_PASSWORD);
  try {
      await userService.updateUserById(user.id, {password});
      await sessionService.deleteSessionRecordsByUserIdAndTokenType(user.id, tokenTypes.RESET_PASSWORD);
  } catch (err) {
    throw ClientError.BadRequest('Please authenticate')
}};



export {
  login,
  logout,
  verifyEmail,
  refreshAuth,
  sendForgotPasswordEmail,
  resetUserPassword
};


