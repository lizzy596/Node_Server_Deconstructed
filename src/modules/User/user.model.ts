import { Schema, model, Model, Document, HydratedDocument } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import toJSON from "../../config/db/plugins/toJSON.plugin.js";
import paginate from "../../config/db/plugins/paginate.plugin.js";

// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   timestamps: string;
// }


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  timestamps: string;
}

interface IUserMethods {
  // searchableFields(): string;
  // isEmailTaken(): boolean;
  isPasswordMatch(password: string): boolean;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  createFully(): Promise<HydratedDocument<IUser, IUserMethods>>;
}
const schema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true, trim: true },
  email: {  type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      } }
    },
  password: {   
    type: String,
    trim: true,
    minlength: 8,
    validate(value:string) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error('Password must contain at least one letter and one number');
      }
    },
    private: true, 
   },
  role: { 
    type: String, 
    default: 'user'
   },


},  

{
  timestamps: true,
},





);

schema.plugin(toJSON);
schema.plugin(paginate);

schema.statics.searchableFields = function () {
  return ['name', 'email'];
 };

 schema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
// schema.methods.isPasswordMatch = async function (password: string) {
//   const userPassword = this.password;
//   return bcrypt.compare(password, userPassword);
// };

schema.method('isPasswordMatch', function isPasswordMatch(password: string): Promise<boolean> {
  const userPassword = this.password;
  return bcrypt.compare(password, userPassword);

});

schema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


const User = model<IUser, UserModel>('User', schema);

export default User;