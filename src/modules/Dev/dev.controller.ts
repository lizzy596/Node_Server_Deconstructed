import { Request, Response } from 'express';
import catchAsync from '../../config/utils/catchAsync.util.js';
//import config from '../../config/config.js';
import { generateAuthTokens } from '../Auth/utils/jwt.util.js';





function calculateExpiration() {
  const now = new Date();
  const expirationTime = new Date(now.getTime() + 30 * 60000);
  console.log('expiration time: ' + expirationTime)
  const expirationTimeInSeconds = Math.floor(expirationTime.getTime() / 1000);
  return expirationTimeInSeconds;
}


export const dev = catchAsync(async (_req: Request, res: Response) => {
  const userId = '6658fbc55ac2f3b1099449dc';
  const tokens = await generateAuthTokens(userId);
  console.log('token: ' + JSON.stringify(tokens));
  const exp = calculateExpiration();
  console.log('expiration: ' + exp)
  res.send(tokens);
});

