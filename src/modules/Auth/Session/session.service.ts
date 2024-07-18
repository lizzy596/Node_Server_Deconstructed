import Session, { ISession} from "./session.model.js";




 const createSessionRecord = async (sessionBody: ISession): Promise<ISession> => {
  return Session.create(sessionBody);
};

 const getSessionRecordByUserId = async (userId: string, tokenType: string) => {
  return await Session.findOne({user: userId, tokenType, valid: true });
};

 const getSessionRecordByToken = async (token: string, tokenType: string) => {
  return await Session.findOne({token, tokenType, valid: true });
};

const invalidateAuthSession = async (user: string): Promise<ISession | null> => {
   return Session.findOneAndUpdate({user}, {valid: false}, {returnNewDocument: true})
}

const deleteSessionById = async (userId: string) => {
  return await Session.findOneAndDelete({user: userId });
};

const deleteSessionRecordsByUserId = async (userId: string) => {
    return await Session.deleteMany({user: userId });
};
 const deleteSessionRecord = async (userId: string, tokenType: string) => {
 return await Session.deleteMany({user: userId, tokenType: tokenType});
}


export {
  createSessionRecord,
  getSessionRecordByUserId,
  getSessionRecordByToken,
  invalidateAuthSession,
  deleteSessionById,
  deleteSessionRecordsByUserId,
  deleteSessionRecord
}