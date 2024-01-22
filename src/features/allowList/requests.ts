import { apiService } from '@/services/api';
import { AddAllowItem, AllowItem, GetListApiRes } from './types';

export async function findAllowList(): Promise<GetListApiRes> {
    const response = await apiService.get<AllowItem[]>('/allowList');

    return response;
}

export async function addAllowList(data: AddAllowItem): Promise<any> {
    const response = await apiService.post('/allowList', data);

    return response;
}

export async function addMultipleAllowList(data: AddAllowItem[]): Promise<any> {
    const response = await apiService.post('/allowList/multiple', data);

    return response;
}

export async function updateAllowList(data: AllowItem): Promise<any> {
    const response = await apiService.put(`/allowList/${data._id}`, data);

    return response;
}

export async function deletAllowList(id: string): Promise<any> {
    const response = await apiService.delete(`/allowList/${id}`);

    return response;
}
