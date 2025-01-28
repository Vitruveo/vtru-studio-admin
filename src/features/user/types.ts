import { APIResponse } from '../common/types';

interface Email {
    email: string;
    checkedAt: Date | null;
}

interface Login {
    email: string;
}

interface Profile {
    avatar: string | null;
    phone: string | null;
    language: string | null;
    location: string | null;
}
export interface User {
    _id: string;
    name: string;
    emails: Email[];
    login: Login;
    profile: Profile;
    roles: string[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
export interface UserSliceState {
    byId: { [key: string]: User };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
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

export interface GetUsersPaginatedParams {
    page: number;
    limit: number;
    search?: string;
}

export interface GetUsersPaginatedResponse {
    data: User[];
    page: number;
    total: number;
    totalPage: number;
    limit: number;
}

export interface UserAddReq {
    name: string;
    login: { email: string };
}

export interface UserUpdateReq {
    _id: string;
    name: string;
    emails: Email[];
    login: Login;
    profile: Profile;
    roles: string[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
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

export type UserAddApiRes = APIResponse<UserAddRes>;

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
