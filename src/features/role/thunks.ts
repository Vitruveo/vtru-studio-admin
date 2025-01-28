import { createRole, deleteRole, getRolesPaginated, updateRole } from './requests';
import {
    GetRolesPaginatedParams,
    GetRolesPaginatedResponse,
    RoleApiResCreate,
    RoleApiResDelete,
    RoleApiResUpdate,
    RoleReqCreate,
    RoleReqDelete,
    RoleReqUpdate,
} from './types';
import { ReduxThunkAction } from '@/store';
import { roleActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';
import { AxiosError } from 'axios';

export function roleGetPaginatedThunk(
    params: GetRolesPaginatedParams
): ReduxThunkAction<Promise<GetRolesPaginatedResponse>> {
    return async function () {
        const response = await getRolesPaginated(params);

        return response.data.data!;
    };
}

export function roleCreateThunk(payload: RoleReqCreate): ReduxThunkAction<Promise<RoleApiResCreate | void>> {
    return async function (dispatch, _getState) {
        try {
            const response = await createRole({
                name: payload.name,
                description: payload.description,
                permissions: payload.permissions,
            });

            dispatch(
                roleActionsCreators.setRole({
                    _id: response.data!.insertedId,
                    name: payload.name,
                    description: payload.description,
                    permissions: [],
                    framework: {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdBy: '',
                        updatedBy: '',
                    },
                })
            );

            dispatch(
                toastrActionsCreators.displayToastr({
                    message: 'Role created successfully',
                    type: 'success',
                })
            );

            return response;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'Unauthorized',
                        type: 'error',
                    })
                );
            }
        }
    };
}

export function roleUpdateThunk(payload: RoleReqUpdate): ReduxThunkAction<Promise<RoleApiResUpdate | void>> {
    return async function (dispatch, _getState) {
        try {
            const response = await updateRole({
                _id: payload._id,
                name: payload.name,
                description: payload.description,
                permissions: payload.permissions,
                framework: payload.framework,
            });

            dispatch(
                roleActionsCreators.setRole({
                    _id: payload._id,
                    name: payload.name,
                    description: payload.description,
                    permissions: payload.permissions,
                    framework: payload.framework,
                })
            );

            dispatch(
                toastrActionsCreators.displayToastr({
                    message: 'Role updated successfully',
                    type: 'success',
                })
            );

            return response;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'Unauthorized',
                        type: 'error',
                    })
                );
            }
        }
    };
}

export function roleDeleteThunk(payload: RoleReqDelete): ReduxThunkAction<Promise<RoleApiResDelete | void>> {
    return async function (dispatch, _getState) {
        try {
            const response = await deleteRole(payload._id);

            dispatch(roleActionsCreators.removeRole(payload._id));

            return response;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'Unauthorized',
                        type: 'error',
                    })
                );
            }
        }
    };
}
