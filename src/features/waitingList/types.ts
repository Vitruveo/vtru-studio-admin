import { APIResponse } from '../common/types';

export interface WaitingItem {
    _id: string;
    email: string;
    attempts?: number;
    attemptDates?: Date[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export type GetListApiRes = APIResponse<WaitingItem[]>;

export interface InitialState {
    byId: { [key: string]: WaitingItem };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
    error: string;
}
