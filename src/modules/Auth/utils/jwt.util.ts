import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import dayjs from "dayjs";
import * as sessionService from '../Session/session.service.js'



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


export const generateJWT = (payload: jsonPayload, expiration: string) => {
return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
}


export const verifyJWT = async (token:string)  => {
return jwt.verify(token, config.jwt.secret);
 };

 export const generateAuthTokens = async (userId: string): Promise<IAuthTokens> => {
  await sessionService.deleteSessionRecordsByUserId(userId);
  const accessToken = generateJWT({ sub: userId, tokenType: 'access' }, config.jwt.accessTokenExpiration);
  const access = calculateExpiration(config.jwt.accessTokenExpiration);
  const refreshToken = generateJWT({ sub: userId, tokenType: 'refresh' }, config.jwt.refreshTokenExpiration);
  const refresh = calculateExpiration(config.jwt.refreshTokenExpiration);
  await sessionService.createSessionRecord({ user: userId, tokenType: 'refresh', token: refreshToken });
   return {
    accessToken: { token: accessToken, expiration: access},
    refreshToken: { token: refreshToken, expiration: refresh} 
  };
};

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





 





