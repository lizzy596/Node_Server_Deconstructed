import Task, { TaskDocument } from "./task.model.js";
import paginate from "config/db/plugins/paginate.plugin.js";
export const createTask = async (taskBody: any): Promise<TaskDocument> => {
  return Task.create(taskBody);
};

export const queryTasks = async (filter: any, options: any, search: string): Promise<any> => {
  const Tasks = await Task.paginate(filter, options, search);
  return Tasks;
};

export const getTaskById = async (id: string): Promise<TaskDocument | null> => {
  return Task.findById(id);
};

export const updateTaskById = async (taskId: string, updateBody: any): Promise<TaskDocument | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    return null;
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

export const deleteTaskById = async (taskId: string): Promise<TaskDocument | null> => {
  const task = await getTaskById(taskId);
  if (!task) {
    return null;
  }
  await task.deleteOne();
  return task;
};

