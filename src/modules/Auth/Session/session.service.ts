//import { Document } from 'mongoose';
import Session, { ISession} from "./session.model.js";




export const createSessionRecord = async (sessionBody: ISession): Promise<ISession> => {
  return Session.create(sessionBody);
};


export const deleteSessionRecordsByUserId = async (userId: string) => {
    await Session.deleteMany({user: userId});
};