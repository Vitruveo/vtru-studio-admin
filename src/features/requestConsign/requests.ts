import axios from 'axios';
import { apiService } from '@/services/api';
import {} from './types';
import { APIResponse } from '../common/types';
import { BASE_URL_BATCH } from '@/constants/api';

export async function updateStatusRequestConsign({
    id,
    status,
    logs,
    comments,
}: {
    id: string;
    status: 'approved' | 'rejected' | 'running' | 'error';
    logs?: any[];
    comments?: any[];
}): Promise<APIResponse> {
    const response = await apiService.patch(`/requestConsign/${id}`, {
        status,
        ...(logs && logs.length > 0 && { logs }),
        ...(comments && comments.length > 0 && { comments }),
    });

    return response;
}

export async function consign(id: string) {
    return axios.post(`${BASE_URL_BATCH}/consign/${id}`);
}

export async function eventsByTransaction(transaction: string) {
    return axios.get(`${BASE_URL_BATCH}/events/${transaction}`);
}
