import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../../modules/Auth/helpers/jwt.helper';
import ClientError from '../error/ClientError';
import * as userService from '../../modules/User/user.service';
import { applicationRoles, rolePermissions } from '../permissions';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
      };
    }
  }
}

const checkAuthorization = (role:string, permission:string) => {
  let isAuthorized =true;
  //ensures role type exists
  if(!applicationRoles.includes(role)) {
    console.log('ehre')
    isAuthorized = false;
;
  }
  //ensures role includes necessary permission
 if(!rolePermissions?.get(role)?.includes(permission)) {
  isAuthorized = false;
 }
 return isAuthorized;
};

export const auth = (permissionRequired: string) => async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const tokenString = req.headers.authorization?.split(' ')[1];
  if (!tokenString) {
    return next(ClientError.Unauthorized('Invalid credentials'));
  }

  try {
    const decoded = await verifyJWT(tokenString);
    const { sub } = decoded;

    if (!sub) {
      return next(ClientError.Unauthorized('Invalid credentials'));
    }

    if (typeof sub === 'string') {
      const user = await userService.getUserById(sub);
      if (!user) {
        return next(ClientError.Unauthorized('Invalid credentials'));
      } 
      
    if (!checkAuthorization(user.role, permissionRequired)) {
        return next(ClientError.Unauthorized('Invalid credentials'));
        }
    req.user = { id: user._id };
      
    }
  } catch (err) {
    return next(ClientError.Unauthorized('Invalid credentials'));
  }


  next();
};










// export const auth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
//   const tokenString = req.headers.authorization?.split(' ')[1];
//   if (!tokenString) {
//     return next(ClientError.Unauthorized('Invalid credentials'));
//   }

//   try {
//     const decoded = await verifyJWT(tokenString);
//     const { sub } = decoded;

//     if (!sub) {
//       return next(ClientError.Unauthorized('Invalid credentials'));
//     }
//     if(typeof sub === 'string') {
//       const user = await userService.getUserById(sub);
//       if (!user) {
//         return next(ClientError.Unauthorized('Invalid credentials'));
//       } else {
//         req.user = { id: user._id };
//   }
//  }
// } catch (err) {
//     return next(ClientError.Unauthorized('Invalid credentials'));
//   }

//   next();
// };


// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new CustomError.UnauthorizedError(
//         'Unauthorized to access this route'
//       );
//     }
//     next();
//   };
// };