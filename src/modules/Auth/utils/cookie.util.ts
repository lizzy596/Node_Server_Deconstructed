import { Response } from 'express';


interface tokenData {
  token: string, 
  expiration: {expDate: string, expSeconds: number}
}

export const setCookieToken = async (res: Response, tokenData: tokenData) => {
  const cookieOptions = {
    secure: true, 
    httpOnly: false, 
    partitioned: true,
    maxAge: tokenData.expiration.expSeconds,
    expiresIn: tokenData.expiration.expDate
  };
  res.cookie("refreshToken", tokenData.token, cookieOptions);
  }

  


export const clearCookieToken = (res: Response) => {
  res.clearCookie('refreshCookie');
}




