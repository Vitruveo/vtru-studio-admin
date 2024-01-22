import { apiService } from '@/services/api';
import { WaitingItem, GetListApiRes } from './types';

export async function findWaitingList(): Promise<GetListApiRes> {
    const response = await apiService.get<WaitingItem[]>('/waitingList');

    return response;
}

export async function addWaitingList(data: any): Promise<any> {
    const response = await apiService.post('/waitingList', data);

    return response;
}

export async function addMultipleWaitingList(data: any): Promise<any> {
    const response = await apiService.post('/waitingList/multiple', data);

    return response;
}

export async function updateWaitingList(data: WaitingItem): Promise<any> {
    const response = await apiService.put(`/waitingList/${data._id}`, data);

    return response;
}

export async function deletWaitingList(id: string): Promise<any> {
    const response = await apiService.delete(`/waitingList/${id}`);

    return response;
}
