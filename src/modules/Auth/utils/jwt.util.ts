import jwt from 'jsonwebtoken';
import config from '../../../config/config';
import * as sessionService from '../Session/session.service.js'


interface jsonPayload {
  sub: string;
  tokenType: string;
  iat?: number;
  exp?: number;
}

interface authTokens {
  accessToken: { token: string; expiration: {expDate: Date, expSeconds: number}},
   refreshToken: { token: string; expiration: {expDate: Date, expSeconds: number} }
}


export const generateJWT = (payload: jsonPayload, expiration: string) => {
return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
}


export const verifyJWT = async (token:string)  => {
return jwt.verify(token, config.jwt.secret);
 };

 export const generateAuthTokens = async (userId: string): Promise<authTokens> => {
  const accessToken = generateJWT({ sub: userId, tokenType: 'access' }, config.jwt.accessTokenExpiration);
  const access = calculateExpiration(3, 'm');
  const refreshToken = generateJWT({ sub: userId, tokenType: 'refresh' }, config.jwt.refreshTokenExpiration);
  const refresh = calculateExpiration(30, 'd');

  await sessionService.createSessionRecord({ user: userId, tokenType: 'refresh' });
   return {
    accessToken: { token: accessToken, expiration: access},
    refreshToken: { token: refreshToken, expiration: refresh} 
  };
};


function calculateExpiration(num:number, unit: string) {
  const multiplier = unit === 'm' ? 60: 86400;
  const now = new Date();
  const expiryDate= new Date(now.getTime() + num * multiplier * 1000);
  const expirySeconds = Math.floor(expiryDate.getTime() / 1000);
  return {expDate: expiryDate, expSeconds: expirySeconds}
}






 





