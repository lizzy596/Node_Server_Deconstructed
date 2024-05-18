import mongoose, {Schema, Model, Document} from "mongoose";
import toJSON from "../../config/db/plugins/toJSON.plugin.js";
import paginate from "config/db/plugins/paginate.plugin.js";
//import { Paginator } from "config/db/plugins/paginate.plugin.js";

export interface Paginator {
  paginate(): void
}

export interface ITask extends Document, Paginator {
  priority: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskModel extends Model<ITask, {}> {
  searchableFields(): string[]
}  




const taskSchema = new Schema<ITask, TaskModel>(
  {
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },
    note: {
      type: String,
      required: true,
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
     }
    
  },
 
},


);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

// taskSchema.pre('save', function(next) {
//   const now = Date.now();
//   this.updatedAt = now;
//   if (!this.createdAt) {
//     this.createdAt = now;
//   }
//   next();
// });

taskSchema.statics.searchableFields = function () {
 return ['priority', 'note'];
};


const Task = mongoose.model<ITask, TaskModel>("Task", taskSchema);

export default Task;

