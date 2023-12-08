import { apiService } from '@/app/services/api';
import {
  Role,
  RoleApiResCreate,
  RoleApiResDelete,
  RoleApiResUpdate,
  RoleReqCreate,
  RoleReqUpdate,
  RoleResCreate,
  RoleResDelete,
  RoleResUpdate,
} from './types';

export async function findManyRoles() {
  const response: Role[] = [];
  return response;
}

export function findOneRole(id: string) {
  const response: Role = {} as Role;
  return response;
}

export async function createRole(data: RoleReqCreate): Promise<RoleApiResCreate> {
  const response = await apiService.post<RoleResCreate>('/roles', data);

  return response;
}

export async function updateRole(data: RoleReqUpdate): Promise<RoleApiResUpdate> {
  const response = await apiService.put<RoleResUpdate>(`/roles/${data._id}`, data);

  return response;
}

export async function deleteRole(id: string): Promise<RoleApiResDelete> {
  const response = await apiService.delete<RoleResDelete>(`/roles/${id}`);

  return response;
}
