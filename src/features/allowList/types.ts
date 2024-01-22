import { APIResponse } from '../common/types';

export interface AddAllowItem {
    email: string;
}

export interface AllowItem {
    _id: string;
    email: string;
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export type GetListApiRes = APIResponse<AllowItem[]>;
