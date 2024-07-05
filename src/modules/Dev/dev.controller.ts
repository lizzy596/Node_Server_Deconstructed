import { Request, Response } from 'express';
import catchAsync from '../../config/utils/catchAsync.util.js';
// import * as sessionService from '../Auth/Session/session.service.js';
// import ClientError from '../../config/error/ClientError.js';
import { verifyJWT } from '../../modules/Auth/utils/jwt.util.js';
//import dayjs from "dayjs";
// import config from '../../config/config.js';









export const dev = catchAsync(async (_req: Request, res: Response) => {
  const badToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjU2M2VjODIzMGIzNmI0ZGJkNmU5ZDIiLCJpYXQiOjE3MTcxNzcxNTEsImV4cCI6MTcxNzIxOTE1MSwidHlwZSI6ImFjY2VzcyJ9.oDFK28hFZDUVEodttSGs8tRota32ZlRE9AJe_yZnpm8';
 //const goodToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjU4ZmJjNTVhYzJmM2IxMDk5NDQ5ZGMiLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MjAwNTQ5NDAsImV4cCI6MTcyMDEwODk0MH0.BCkQ5tZN3dKy6ICcDrSdCz4bCKfXEk2eFZi2C-1Hv_E";
const payload = await verifyJWT(badToken)
  // const userId = '6658fbc55ac2f3b1099449dc';
  // await sessionService.deleteSessionRecordsByUserId(userId)
  // throw ClientError.BadRequest('something went wrong');

  res.send(payload);
});

