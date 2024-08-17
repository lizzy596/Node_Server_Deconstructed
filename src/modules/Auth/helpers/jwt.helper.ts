import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import dayjs from "dayjs";

import tokenTypes from '../Session/token.types.js';
import ClientError from '../../../config/error/ClientError.js';
import { IUser } from 'modules/User/user.model.js';
import * as sessionService from '../Session/session.service.js';
import * as userService from '../../User/user.service.js';



interface jsonPayload {
  sub: string;
  tokenType: string;
  iat?: number;
  exp?: number;
}

export interface IAuthTokens {
  accessToken: { token: string; expiration: {expDate: string, expSeconds: number}},
   refreshToken: { token: string; expiration: {expDate: string, expSeconds: number} }
}

const generateJWT = (payload: jsonPayload, expiration: string): string => {
  return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
};


const verifyJWT = async (token:string)  => {
  try {
   const payload = await jwt.verify(token, config.jwt.secret);
        if(!payload.sub || typeof payload.sub !== 'string') {
        throw ClientError.BadRequest('Invalid credentials')
        }
        return payload.sub;
  } catch (err) {
    throw ClientError.BadRequest('Invalid credentials')
  }
 };

 const verifyTokenAndSession = async (token:string, tokenType:string):Promise<IUser>  => {
    const userId = await verifyJWT(token)
      try {
      const session = await sessionService.getSessionRecordByUserId(userId, tokenType);
       if(!session) {
      throw  ClientError.Unauthorized('Please authenticate');
      }
     const user = await userService.getUserById(session.user);
     if(!user) {
     throw ClientError.BadRequest('Please Authenticate');
  }
      return user;
   } catch (err) {
      throw ClientError.BadRequest('Please authenticate')
    }
 };




 const generateAuthTokens = async (userId: string): Promise<IAuthTokens> => {
  await sessionService.deleteAllSessionRecordsByUserId(userId);
  const accessToken = generateJWT({ sub: userId, tokenType: tokenTypes.ACCESS}, config.jwt.accessTokenExpiration);
  const access = calculateExpiration(config.jwt.accessTokenExpiration);
  const refreshToken = generateJWT({ sub: userId, tokenType: tokenTypes.REFRESH }, config.jwt.refreshTokenExpiration);
  const refresh = calculateExpiration(config.jwt.refreshTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: tokenTypes.REFRESH, token: refreshToken });
   return {
    accessToken: { token: accessToken, expiration: access},
    refreshToken: { token: refreshToken, expiration: refresh} 
  };
};


const generateEmailVerificationToken = async (userId: string) => {
  await sessionService.deleteSessionRecordsByUserIdAndTokenType(userId, tokenTypes.VERIFY_EMAIL);
  const emailToken = generateJWT({ sub: userId, tokenType: tokenTypes.VERIFY_EMAIL}, config.jwt.verifyEmailTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: tokenTypes.VERIFY_EMAIL, token: emailToken });
  return emailToken;
}


const generatePasswordResetToken = async (userId: string) => {
  await sessionService.deleteSessionRecordsByUserIdAndTokenType(userId, tokenTypes.RESET_PASSWORD);
  const passwordResetToken = generateJWT({ sub: userId, tokenType: tokenTypes.RESET_PASSWORD}, config.jwt.accessTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: tokenTypes.RESET_PASSWORD, token: passwordResetToken });
  return passwordResetToken;
}



function calculateExpiration(expires:string) {
  const unit = expires.slice(-1);
  const num = parseInt(expires.match(/\d+/)![0], 10);
  const dateUnit = unit === 'm' ? 'minute' : 'day';
  const expiry = dayjs().add(num, dateUnit);
  return {
    expDate: expiry.format(),
    expSeconds: expiry.unix()
  };
}



export {
  verifyJWT,
  generateAuthTokens,
  verifyTokenAndSession,
  generateEmailVerificationToken,
  generatePasswordResetToken

}

 





