import { Request, Response } from 'express';
import httpStatus from 'http-status';
import * as taskService from './task.service.js';
import catchAsync from '../../config/utils/catchAsync.util.js';
import ClientError from '../../config/error/ClientError.js';
//import pick from '../../config/utils/pick.js';



const getTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(req.params.taskId!);
  if (!task) {
    throw ClientError.BadRequest("Task not found");
  }
  res.send(task);
});

const createTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

const getTasks = catchAsync(async (req: Request, res: Response) => {
  const tasks = await taskService.queryTasks(req?.user?.id!);
  res.send(tasks);
});



const updateTask = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.updateTaskById(req.params.taskId!, req.body);
  res.send(task);
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await taskService.deleteTaskById(req.params.taskId!);
  res.status(httpStatus.NO_CONTENT).send();
});

export {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};


// const queryTasks = catchAsync(async (req: Request, res: Response) => {
//   console.log('Cookies:sgfdgsgdf ', req.cookies)
//   // const filter = pick(req.query, ["name", "role"]);
//   // const options = pick(req.query, ["sortBy", "limit", "page"]);
//   // const { search } = pick(req.query, ["search"]);
//   // const result = await taskService.queryTasks(filter, options, search);
//   const result = 'apple'
//   res.send(result);
// });