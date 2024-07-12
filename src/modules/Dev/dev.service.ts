import { Document } from 'mongoose';
import Dev, {IDev} from "./dev.model.js";



export const createDev = async (devBody: any): Promise<IDev> => {
  return Dev.create(devBody);
};


export const queryDevs = async (searchProperty: string): Promise<Document[]> => {
  const devs = await Dev.find({searchProperty});
  return devs;
}; 

export const getDevById = async (id: string): Promise<IDev | null> => {
  return Dev.findById(id);
};

export const updateDevById = async (devId: string, updateBody: any): Promise<IDev | null> => {
  const dev = await getDevById(devId);
  if (!dev) {
    return null;
  }
  Object.assign(dev, updateBody);
  await dev.save();
  return dev;
};

export const deleteDevById = async (devId: string): Promise<IDev | null> => {
  const dev = await getDevById(devId);
  if (!dev) {
    return null;
  }
  await dev.deleteOne();
  return dev;
};