import { verifyJWT } from '../modules/Auth/utils/jwt.util';
//import * as userService from '../modules/User/user.service.js'

export const authHandshake = (token:string) => {
const payload = verifyJWT(token);
if(payload) {
  return true;
} else {
  return false;
}
}