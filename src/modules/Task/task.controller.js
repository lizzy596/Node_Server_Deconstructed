const httpStatus = require("http-status");
const taskService = require("./task.service");
const catchAsync = require("../../config/utils/catchAsync");
const ClientError = require("../../config/error/ClientError");

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.taskId);
  if (!task) {
    throw ClientError.BadRequest("Task not found");
  }
  res.send(task);
});

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

const getTasks = async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const { search } = pick(req.query, ["search"]);
  const result = await taskService.queryTasks(filter, options, search);
  res.send(result);
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

//this is with no error handling at all, if there is no task, the user will not

//get any feedback just a 200 status code and nothing returned
// const getTask = async (req, res) => {
//     const task = await taskService.getTaskById(req.params.taskId);
//     res.send(task);
// };

//not passing error to next, and the app will crash

// const getTask = async (req, res) => {
//   const task = await taskService.getTaskById(req.params.taskId);
//   if(!task) {
//     throw new Error('Task not found');
//   }
//   res.send(task);
// };

//this crashes
// const getTask = async (req, res, next) => {
//   const task = await taskService.getTaskById(req.params.taskId);
//   if(!task) {
//     throw new Error('Task not found');
//     next();
//   }
//   res.send(task);
// };

//this will catch the error and display: 'task not found'
// const getTask = async (req, res, next) => {
//   try {
//     const task = await taskService.getTaskById(req.params.taskId);

//     if(!task) {
//       throw new Error('Task not found');
//     }
//     res.send(task);

//   } catch (e) {
//     next(e);

//   }

// };

//wrapped with an async wrapper, to avoid writing try/catch for every controller

// const getTask = catchAsync(async (req, res) => {
//     const task = await taskService.getTaskById(req.params.taskId);
//     if(!task) {
//     throw new Error('Task not found');
//     }
//     res.send(task);
// });
