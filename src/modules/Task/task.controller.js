const httpStatus = require('http-status');
const taskService = require('./task.service');

const createTask = async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
};

const getTasks = async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await taskService.queryTasks(filter, options, search);
  res.send(result);
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    if (!task) {
      const error = new Error('Task not found')
      error.status = 406
      next(error);
      return
    }
    console.log(task.title);
    res.send(task);

  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res) => {
  const task = await taskService.updateTaskById(req.params.taskId, req.body);
  res.send(task);
};

const deleteTask = async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};