import mongoose, {Schema, Model } from "mongoose";
import toJSON from "../../../config/db/plugins/toJSON.plugin.js";
import paginate from "../../../config/db/plugins/paginate.plugin.js";
import tokenTypes from './token.types.js';


export interface Paginator {
  paginate(): void
}
export interface ISession {
  tokenType: string;
  token: string;
  expiration?: Date;
  valid?: boolean;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionModel extends Model<ISession, {}> {
  searchableFields(): string[]
}  




const schema = new Schema<ISession, SessionModel>(
  {
    token: {
      type: String,
      required: true,
    },
    tokenType: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expiration: {
      type: Date,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: String,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }


    
  },


  {
    statics: {
     searchableFields() {
      return [] as string[]
     },
    
  },
 
},


);

// add plugin that converts mongoose to json
schema.plugin(toJSON);
//@ts-ignore
schema.plugin(paginate);



schema.statics.searchableFields = function () {
 return ['tokenType'];
};

schema.statics.paginate = paginate;


const Session = mongoose.model<ISession, SessionModel>("Session", schema);

export default Session;