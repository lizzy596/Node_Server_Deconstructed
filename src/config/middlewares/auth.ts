import { Request, Response, NextFunction } from 'express';
import ClientError from '../error/ClientError';
import * as userService from '../../modules/User/user.service';

//Authenticates the user with a session
export const auth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      // @ts-ignore
  const userId = req.session.user;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw ClientError.Forbidden('not authenticated');
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};




