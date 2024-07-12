import mongoose, {Schema, Document } from "mongoose";
import toJSON from "../../config/db/plugins/toJSON.plugin.js";


export interface IDev extends Document {
  unique?: string,
  mismatch: boolean,
  searchTerm?: string,

}

const devSchema = new Schema<IDev>(
  {
    unique: {
      type: String,
      unique: true
    },
    mismatch: {
      type: Boolean,
      required: true
    },
    searchTerm: {
      type: String,
    }
  },
);

// add plugin that converts mongoose to json
devSchema.plugin(toJSON);


const Dev = mongoose.model('Dev', devSchema);

export default Dev;