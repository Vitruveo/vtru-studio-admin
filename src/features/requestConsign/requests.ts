import axios from 'axios';
import { apiService } from '@/services/api';
import { APIResponse } from '../common/types';
import { BASE_URL_BATCH } from '@/constants/api';
import { GetRequestConsigns, RequestConsignAddComment, RequestConsignUpdateCommentVisibility } from './types';

export async function updateStatusRequestConsign({
    id,
    status,
    logs,
}: {
    id: string;
    status: 'approved' | 'rejected' | 'running' | 'error' | 'draft';
    logs?: any[];
}): Promise<APIResponse> {
    const response = await apiService.patch(`/requestConsign/${id}`, {
        status,
        ...(logs && logs.length > 0 && { logs }),
    });

    return response;
}

export async function consign(id: string) {
    return axios.post(`${BASE_URL_BATCH}/consign/${id}`);
}

export async function eventsByTransaction(transaction: string) {
    return axios.get(`${BASE_URL_BATCH}/events/${transaction}`);
}

export async function updateRequestConsignComments({ id, comment }: RequestConsignAddComment) {
    return apiService.patch(`/requestConsign/comments/${id}`, { comment });
}

export async function updateRequestConsignCommentVisibility({
    id,
    isPublic,
    commentId,
}: RequestConsignUpdateCommentVisibility) {
    return apiService.patch(`/requestConsign/comments/${id}/visibility`, { commentId, isPublic });
}

export async function getRequestConsigns({ status, page = 1, limit = 10 }: GetRequestConsigns) {
    return apiService.get(`/requestConsign?status=${status}&page=${page}&limit=${limit}`);
}
