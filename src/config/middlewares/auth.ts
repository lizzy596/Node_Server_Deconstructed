import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import ClientError from '../error/ClientError';
import * as userService from '../../modules/User/user.service';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
      };
    }
  }
}


export const auth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const tokenString = req.headers.authorization?.split(' ')[1];
  if (!tokenString) {
    return next(ClientError.Unauthorized('Invalid credentials'));
  }

  try {
    const decoded = verifyJwt(tokenString);
    const { sub } = decoded;

    if (!sub) {
      return next(ClientError.Unauthorized('Invalid credentials'));
    }
    if(typeof sub === 'string') {
      const user = await userService.getUserById(sub);
      if (!user) {
        return next(ClientError.Unauthorized('Invalid credentials'));
      } else {
        req.user = { id: user._id };
  }
 }
} catch (err) {
    return next(ClientError.Unauthorized('Invalid credentials'));
  }

  next();
};
