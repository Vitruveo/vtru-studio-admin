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
export interface AuthSliceState extends User {
    token: string;
    permissions: string[];
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

export interface UserOTPConfirmReq {
    email: string;
    code: string;
}

export interface UserOTPConfirmRes {
    user: User;
    token: string;
}

export type UserAuthApiRes = APIResponse<UserAuthRes>;
export type UserLoginApiRes = APIResponse<string>;
export type UserOTPConfirmApiRes = APIResponse<UserOTPConfirmRes>;
