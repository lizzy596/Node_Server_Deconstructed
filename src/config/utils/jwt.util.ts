import jwt from 'jsonwebtoken';
import config from '../config';

interface jsonLoginPayload {
  sub: string;
  tokenType: string;
}


export const generateJWT = (payload: jsonLoginPayload, expiration: string) => {
return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
}


export const verifyJwt = (token:string) => {
return jwt.verify(token, config.jwt.secret);
 };




