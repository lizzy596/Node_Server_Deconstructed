import * as userService from '../User/user.service.js'
import {IUser } from 'modules/User/user.model.js';
import httpStatus from 'http-status';
import ClientError from '../../config/error/ClientError.js';




export const login = async (email: string, password: string): Promise<IUser> => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ClientError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

export const logout = async (id: string) => {
  console.log(id)
 console.log('hey')
};




