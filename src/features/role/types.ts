import { APIResponse } from '../common/types';

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleSliceState {
  name: string;
  description: string;
  permissions: string[];
  byId: { [key: string]: Role };
  status: '' | 'loading' | 'succeeded' | 'failed';
  error: string;
}

export type RoleApiResFindMany = APIResponse<Role[]>;
export type RoleApiResFindOne = APIResponse<Role>;

export interface RoleReqDelete {
  _id: string;
}

export interface RoleResDelete {
  acknowledged: boolean;
  deletedCount: number;
}
export type RoleApiResDelete = APIResponse<RoleResDelete>;

export interface RoleReqCreate {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleResCreate {
  acknowledged: boolean;
  insertedId: string;
}
export type RoleApiResCreate = APIResponse<RoleResCreate>;

export interface RoleReqUpdate {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
}
export interface RoleResUpdate {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: string;
  upsertedCount: number;
  matchedCount: number;
}
export type RoleApiResUpdate = APIResponse<RoleResUpdate>;
