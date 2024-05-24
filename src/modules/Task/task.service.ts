import Task, { ITask} from "./task.model.js";
import {IOptions, QueryResult} from "config/db/plugins/paginate.plugin.js";



export const createTask = async (taskBody: any): Promise<ITask> => {
  return Task.create(taskBody);
};

export const queryTasks = async (filter: Record<string, any>, options: IOptions, search: string): Promise<QueryResult> => {
   // @ts-ignore 
  const Tasks = await Task.paginate(filter, options, search);
  return Tasks;
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  return Task.findById(id);
};

export const updateTaskById = async (taskId: string, updateBody: any): Promise<ITask | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    return null;
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

export const deleteTaskById = async (taskId: string): Promise<ITask | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    return null;
  }
  await task.deleteOne();
  return task;
};

