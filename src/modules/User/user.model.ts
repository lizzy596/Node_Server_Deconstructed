import { Model, Schema, HydratedDocument, model } from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
}

interface IUserMethods {
  fullName(): string;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  createWithFullName(name: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const schema = new Schema<IUser, UserModel, IUserMethods>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
});
schema.static('createWithFullName', function createWithFullName(name: string) {
  const [firstName, lastName] = name.split(' ');
  return this.create({ firstName, lastName });
});
schema.method('fullName', function fullName(): string {
  return this.firstName + ' ' + this.lastName;
});

const User = model<IUser, UserModel>('User', schema);

User.createWithFullName('Jean-Luc Picard').then(doc => {
  console.log(doc.firstName); // 'Jean-Luc'
  doc.fullName(); // 'Jean-Luc Picard'
});