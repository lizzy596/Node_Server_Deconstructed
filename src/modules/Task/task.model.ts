import mongoose, {Schema, Model, Document, ObjectId} from "mongoose";
import toJSON from "../../config/db/plugins/toJSON.plugin.js";
import paginate from "../../config/db/plugins/paginate.plugin.js";

export interface Paginator {
  paginate(): void
}

export interface ITask extends Document, Paginator {
  note: string;
  user: ObjectId,
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskModel extends Model<ITask, {}> {
  searchableFields(): string[]
}  




const schema = new Schema<ITask, TaskModel>(
  {
    note: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
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

// taskSchema.pre('save', function(next) {
//   const now = Date.now();
//   this.updatedAt = now;
//   if (!this.createdAt) {
//     this.createdAt = now;
//   }
//   next();
// });

schema.statics.searchableFields = function () {
 return ['note'];
};

schema.statics.paginate = paginate;


const Task = mongoose.model<ITask, TaskModel>("Task", schema);

export default Task;

