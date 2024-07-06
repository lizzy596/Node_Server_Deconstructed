import { Request, Response } from 'express';
import catchAsync from '../../config/utils/catchAsync.util.js';
import * as sessionService from '../Auth/Session/session.service.js';
//import dayjs from "dayjs";
// import config from '../../config/config.js';









export const dev = catchAsync(async (_req: Request, res: Response) => {
  const userId = '6658fbc55ac2f3b1099449dc';
  await sessionService.deleteSessionRecordsByUserId(userId)
  // const tokens = await generateAuthTokens(userId);
  // console.log('token: ' + JSON.stringify(tokens));
  // const exp = calculateExpiration();
  // console.log('expiration: ' + exp)
  // res.send(tokens);

  // const ans = calculateExpiration('3m')
  res.send('hey');
});

