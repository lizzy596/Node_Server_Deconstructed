import jwt from 'jsonwebtoken';
import config from 'config/config';

interface jsonLoginPayload {
  userId: string;
  tokenType: string;
}


export const generateJWT = (payload: jsonLoginPayload, expiration: number) => {
return jwt.sign(payload, config.jwt.secret, {expiresIn: expiration});
}