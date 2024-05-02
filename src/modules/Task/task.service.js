const Task = require('./task.model');
const { paginate } = require('../../config/DB/plugins');



const createTask = async (taskBody) => {
  return Task.create(taskBody);
};


const queryTasks = async (filter, options, search) => {
  const Tasks = await Task.paginate(filter, options, search);
  return Tasks;
};

const getTaskById = async (id) => {
  return Task.findById(id);
};

const updateTaskById = async (taskId, updateBody) => {
  const task = await getTaskById(taskId);
  Object.assign(task, updateBody);
  await task.save();
  return task;
};


const deleteTaskById = async (taskId) => {
  const task = await getTaskById(taskId);
  await task.deleteOne();
  return task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};