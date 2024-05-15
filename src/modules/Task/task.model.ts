import mongoose, { Schema, Document } from "mongoose";
import toJSON from "../../config/db/plugins/toJSON.plugin.js";

export interface TaskDocument extends Document {
  priority: string;
  note: string;
  reminder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<TaskDocument> = new Schema(
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
    reminder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;

