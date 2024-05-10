const mongoose = require('mongoose');
const { toJSON } = require('../../config/db/plugins');


const taskSchema = mongoose.Schema(
  {
    priority: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'LOW',
      //   index: true,
      // },
      // user: {
      //   type: mongoose.SchemaTypes.ObjectId,
      //   ref: 'User',
      //   required: true,
    },
    note: {
      type: String,
      required: true
    },
    reminder: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;