import { HydratedDocument } from 'mongoose';

export type DocumentMeta<T> = HydratedDocument<T> & {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
};
