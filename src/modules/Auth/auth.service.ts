import {IUser } from 'modules/User/user.model.js';
import httpStatus from 'http-status';
import ClientError from '../../config/error/ClientError.js';
import * as sessionService from './Session/session.service.js';
import Session from './Session/session.model.js';
import * as userService from '../User/user.service.js'
import { verifyJWT, generateAuthTokens, IAuthTokens } from './helpers/jwt.helper.js';
import tokenTypes from './Session/token.types.js';



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
  const userId = await verifyJWT(token);
  const user = await userService.getUserById(userId);
    if(!user) {
      throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  const session = await sessionService.getSessionRecordByUserId(user.id, tokenTypes.REFRESH );
    if(!session) {
      throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
    await sessionService.deleteSessionRecordsByUserId(user.id);
    const tokens = await generateAuthTokens(user.id);
    return { user, tokens };
 } catch (error) {

  throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
 }


}

export const logout = async (refreshToken:string) => {
  if (!refreshToken) return;
  const sessionDoc = await Session.findOne({ token: refreshToken, valid: true, tokenType: tokenTypes.REFRESH });
  if (!sessionDoc) return;
  return sessionService.deleteSessionRecordsByUserId(sessionDoc.user);
};

export const verifyEmail  = async (token:string) => {
  try {
    const userId = await verifyJWT(token);
    const user = await userService.getUserById(userId);
      if(!user) {
        throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }
    const session = await sessionService.getSessionRecordByUserId(user.id, tokenTypes.VERIFY_EMAIL );
      if(!session) {
        await sessionService.deleteSessionRecordsByUserId(user.id);
        throw ClientError.BadRequest('didnt delete session records');
      } else {
        try {
          await userService.updateUserById(user.id, {isEmailVerified: true });
        } catch (err) {
          throw ClientError.BadRequest('did not update user')
        }
       try {
        await sessionService.deleteSessionRecord(user.id, tokenTypes.VERIFY_EMAIL);
       } catch(err) {
        throw ClientError.BadRequest('didn not delete verifiy email record')
       }
       
      }
      
    } catch (error) {
  
    throw new ClientError(httpStatus.UNAUTHORIZED, 'Please authenticate');
   }

}




