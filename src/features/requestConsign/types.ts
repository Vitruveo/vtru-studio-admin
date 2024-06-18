import { APIResponse } from '../common/types';

export interface RequestConsign {
    _id: string;
    asset: {
        _id: string;
        title: string;
    };
    creator: {
        _id: string;
        username: string;
        emails: {
            email: string;
            codeHash: string | null;
            checkedAt: Date | null;
        }[];
    };
    when: Date;
    status: string;
    transaction?: string;
    logs?: {
        status: string;
        message: string;
        when: string;
    }[];
    comments?: {
        comment: string;
    }[];
}

export type GetListApiRes = APIResponse<RequestConsign[]>;

export interface InitialState {
    byId: { [key: string]: RequestConsign };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
    error: string;
}
