import axios from 'axios';
import { apiService } from '@/services/api';
import { api3Service } from '@/services/api3';
import { APIResponse } from '../common/types';
import { BASE_URL_API3 } from '@/constants/api';
import {
    GetRequestConsigns,
    RequestConsign,
    RequestConsignAddComment,
    RequestConsignPaginatedResponse,
    RequestConsignUpdateCommentVisibility,
} from './types';

export async function updateStatusRequestConsign({
    id,
    status,
    logs,
}: {
    id: string;
    status: 'approved' | 'rejected' | 'running' | 'error' | 'draft' | 'canceled';
    logs?: any[];
}): Promise<APIResponse> {
    const response = await apiService.patch(`/requestConsign/${id}`, {
        status,
        ...(logs && logs.length > 0 && { logs }),
    });

    return response;
}

export async function consign(id: string) {
    return api3Service.post(`/consign/${id}`, {});
}

export async function eventsByTransaction(transaction: string) {
    return axios.get(`${BASE_URL_API3}/events/${transaction}`);
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

export async function getRequestConsigns({ status, page, search = '', limit = 25 }: GetRequestConsigns) {
    return apiService.get<RequestConsignPaginatedResponse>(
        `/requestConsign?status=${status}&page=${page}&limit=${limit}&search=${search}`
    );
}

export async function getRequestConsignsById(id: string) {
    return apiService.get<RequestConsign>(`/requestConsign/${id}`);
}
