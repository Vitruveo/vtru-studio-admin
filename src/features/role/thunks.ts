import { createAppAsyncThunk } from '@/store/asyncThunk';
import {
  createRole,
  deleteRole,
  updateRole,
} from './requests';
import {
  RoleApiResCreate,
  RoleApiResDelete,
  RoleApiResUpdate,
  RoleReq,
  RoleReqDelete,
  RoleReqUpdate,
} from './types';

export const roleCreateThunk =
  createAppAsyncThunk<
    RoleApiResCreate | undefined,
    RoleReq
  >(
    'roles/create',
    async (
      {
        name,
        description,
        permissions,
      },
      { rejectWithValue, getState }
    ) => {
      try {
        const response =
          await createRole({
            name,
            description,
            permissions,
          });
        return response;
      } catch (error) {
        return rejectWithValue(
          error as string
        );
      }
    }
  );

export const roleUpdateThunk =
  createAppAsyncThunk<
    RoleApiResUpdate | undefined,
    RoleReqUpdate
  >(
    'roles/update',
    async (
      {
        _id,
        name,
        description,
        permissions,
      },
      { rejectWithValue, getState }
    ) => {
      try {
        const response =
          await updateRole(_id, {
            name,
            description,
            permissions,
          });
        return response;
      } catch (error) {
        return rejectWithValue(
          error as string
        );
      }
    }
  );

export const roleDeleteThunk =
  createAppAsyncThunk<
    RoleApiResDelete | undefined,
    RoleReqDelete
  >(
    'roles/delete',
    async (
      { _id },
      { rejectWithValue, getState }
    ) => {
      try {
        const response =
          await deleteRole(_id);
        return response;
      } catch (error) {
        return rejectWithValue(
          error as string
        );
      }
    }
  );
