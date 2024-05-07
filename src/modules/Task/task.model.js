const mongoose = require('mongoose');
const { toJSON } = require('../../config/db/plugins');


const taskSchema = mongoose.Schema(
  {
    title: {
      type: Number,
      required: true,
      //   index: true,
      // },
      // user: {
      //   type: mongoose.SchemaTypes.ObjectId,
      //   ref: 'User',
      //   required: true,
    },
    description: {
      type: String
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