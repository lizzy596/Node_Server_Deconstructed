import User, { IUser} from "./user.model.js";
import {IOptions, QueryResult} from "../../config/db/plugins/paginate.plugin.js";
import ClientError from "../../config/error/ClientError.js";


//@ts-ignore
const createUser = async (userBody: any): Promise<IUser> => {
  //@ts-ignore
if(await User.isEmailTaken(userBody.email)) {
  throw ClientError.BadRequest('Email is already taken');
}
return User.create(userBody);
  
};

const queryUsers = async (filter: Record<string, any>, options: IOptions, search: string): Promise<QueryResult> => {
  //@ts-ignore
  const Users = await User.paginate(filter, options, search);
  return Users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};
const getUserByEmail = async (email:string) => {
  return User.findOne({ email });
};

const updateUserById = async (userId: string, updateBody: any): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    return null;
  }
//@ts-ignore
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw ClientError.BadRequest('Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId: string): Promise<IUser | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw ClientError.NotFound('User Not Found')
  }
  await user.deleteOne();
  return user;
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  queryUsers,
  updateUserById,
  deleteUserById
}