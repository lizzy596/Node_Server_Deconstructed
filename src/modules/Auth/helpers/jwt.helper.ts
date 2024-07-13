import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import dayjs from "dayjs";
import * as sessionService from '../Session/session.service.js';
import tokenTypes from '../Session/token.types.js';
import ClientError from '../../../config/error/ClientError.js';





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


const generateJWT = (payload: jsonPayload, expiration: string) => {
return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
}

const verifyJWT = async (token:string)  => {
  try {
   const payload = await  jwt.verify(token, config.jwt.secret);
        if(!payload.sub || typeof payload.sub !== 'string') {
        throw ClientError.BadRequest('Invalid credentials')
        }
        return payload.sub;
  } catch (err) {
    throw ClientError.BadRequest('Invalid credentials')
  }
 };

 const generateAuthTokens = async (userId: string): Promise<IAuthTokens> => {
  await sessionService.deleteSessionRecordsByUserId(userId);
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
  const emailToken = generateJWT({ sub: userId, tokenType: tokenTypes.VERIFY_EMAIL}, config.jwt.accessTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: tokenTypes.VERIFY_EMAIL, token: emailToken });
  return emailToken;
}


const generatePasswordResetToken = async (userId: string) => {
  const passwordResetToken = generateJWT({ sub: userId, tokenType: tokenTypes.RESET_PASSWORD}, config.jwt.accessTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: tokenTypes.VERIFY_EMAIL, token: passwordResetToken });
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
  generateEmailVerificationToken,
  generatePasswordResetToken

}

 





