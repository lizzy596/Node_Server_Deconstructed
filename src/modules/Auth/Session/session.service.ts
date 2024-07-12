import Session, { ISession} from "./session.model.js";




export const createSessionRecord = async (sessionBody: ISession): Promise<ISession> => {
  return Session.create(sessionBody);
};

export const getSessionRecordByUserId = async (userId: string, tokenType: string) => {
  return await Session.findOne({user: userId, tokenType, valid: true });
};

export const invalidateAuthSession = async (user: string): Promise<ISession | null> => {
   return Session.findOneAndUpdate({user}, {valid: false}, {returnNewDocument: true})
}

export const deleteSessionById = async (userId: string) => {
  return await Session.findOneAndDelete({user: userId });
};

export const deleteSessionRecordsByUserId = async (userId: string) => {
    return await Session.deleteMany({user: userId });
};

export const deleteSessionRecord = async (userId: string, tokenType: string) => {
 return await Session.deleteMany({user: userId, tokenType: tokenType});
}