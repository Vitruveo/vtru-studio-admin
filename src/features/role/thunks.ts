import { createRole, deleteRole, updateRole } from './requests';
import {
  RoleApiResCreate,
  RoleApiResDelete,
  RoleApiResUpdate,
  RoleReqCreate,
  RoleReqDelete,
  RoleReqUpdate,
} from './types';
import { ReduxThunkAction } from '@/store';

export function roleCreateThunk(payload: RoleReqCreate): ReduxThunkAction<Promise<RoleApiResCreate | undefined>> {
  return async function (dispatch, getState) {
    const response = await createRole({
      name: payload.name,
      description: payload.description,
      permissions: payload.permissions,
    });
    return response;
  };
}

export function roleUpdateThunk(payload: RoleReqUpdate): ReduxThunkAction<Promise<RoleApiResUpdate>> {
  return async function (dispatch, getState) {
    const response = await updateRole({
      _id: payload._id,
      name: payload.name,
      description: payload.description,
      permissions: payload.permissions,
    });
    return response;
  };
}

export function roleDeleteThunk(payload: RoleReqDelete): ReduxThunkAction<Promise<RoleApiResDelete>> {
  return async function (dispatch, getState) {
    const response = await deleteRole(payload._id);
    return response;
  };
}
