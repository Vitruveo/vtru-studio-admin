import { APIResponse } from '../common/types';

interface Email {
  email: string;
  checkedAt: Date | null;
}
interface User {
  _id: string;
  name: string;
  emails: Email[];
  login: {
    email: string;
  };
  profile: {
    avatar: string | null;
    phone: string | null;
    language: string | null;
    location: string | null;
  };
  roles: Array<string>;
}
export interface UserSliceState extends User {
  token: string;
  status: string;
  error: string;
}

export interface UserAuthReq {
  email: string;
}

export interface UserLoginReq {
  email: string;
}

export interface UserAuthRes {
  token: string;
  name: string;
  email: string;
}

export interface UserAddReq {
  name: string;
  login: { email: string };
}

export interface UserUpdateReq {
  _id: string;
  name: string;
  profile: {
    avatar: string | null;
    phone: string | null;
    language: string | null;
    location: string | null;
  };
  roles: string[];
  framework: {
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
}

export interface UserDeleteReq {
  _id: string;
}

export interface UserAddRes {
  id: string;
  insertedId: string;
  name: string;
  login: { email: string };
}

export interface UserUpdateRes {
  id: string;
  name: string;
  login: { email: string };
}

export interface UserOTPConfirmReq {
  email: string;
  code: string;
}

export interface UserOTPConfirmRes {
  user: User;
  token: string;
}

export type UserAddApiRes = APIResponse<UserAddRes>;
export type UserAuthApiRes = APIResponse<UserAuthRes>;
export type UserLoginApiRes = APIResponse<string>;
export type UserOTPConfirmApiRes = APIResponse<UserOTPConfirmRes>;

export interface UserResCreate {
  acknowledged: boolean;
  insertedId: string;
}

export interface UserResUpdate {
  acknowledged: boolean;
  insertedId: string;
}

export interface UserResDelete {
  acknowledged: boolean;
  insertedId: string;
}

export type UserApiResCreate = APIResponse<UserResCreate>;
export type UserApiResUpdate = APIResponse<UserResUpdate>;
export type UserApiResDelete = APIResponse<UserResDelete>;
