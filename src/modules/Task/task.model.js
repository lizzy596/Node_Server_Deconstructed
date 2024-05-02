const mongoose = require('mongoose');
const { toJSON } = require('../../config/DB/plugins');


const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    //   index: true,
    // },
    // user: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'User',
    //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
taskSchema.plugin(toJSON);


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;