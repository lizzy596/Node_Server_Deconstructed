import User, { IUser} from "./user.model.js";
import {IOptions, QueryResult} from "../../config/db/plugins/paginate.plugin.js";
import ClientError from "../../config/error/ClientError.js";


//@ts-ignore
export const createUser = async (userBody: any): Promise<IUser> => {
  //@ts-ignore
if(await User.isEmailTaken(userBody)) {
  throw ClientError.BadRequest('Email is already taken');
}
  
};

export const queryUsers = async (filter: Record<string, any>, options: IOptions, search: string): Promise<QueryResult> => {
  //@ts-ignore
  const Users = await User.paginate(filter, options, search);
  return Users;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};
export const getUserByEmail = async (email:string) => {
  return User.findOne({ email });
};

export const updateUserById = async (userId: string, updateBody: any): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }
  await user.deleteOne();
  return user;
};