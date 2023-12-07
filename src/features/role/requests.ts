import { apiService } from '@/app/services/api';
import {
    RoleApiRes,
    RoleApiResCreate,
    RoleApiResDelete,
    RoleApiResUpdate,
    RoleReq,
    RoleRes,
} from './types';

export async function findManyRoles(): Promise<RoleRes[]> {
    const response: RoleRes[] = [];

    return response;
}

export function findOneRole(id: string): Promise<RoleRes> {
    const req: any = {};
    return req;
}

export async function createRole(data: RoleReq) {
    const response = await apiService.post<RoleApiResCreate>('/roles', data);

    return response.data;
}

export async function updateRole(id: string, data: RoleReq) {
    const response = await apiService.put<RoleApiResUpdate>(
        `/roles/${id}`,
        data
    );

    return response.data;
}

export async function deleteRole(id: string) {
    const response = await apiService.delete<RoleApiResDelete>(`/roles/${id}`);

    return response.data;
}
