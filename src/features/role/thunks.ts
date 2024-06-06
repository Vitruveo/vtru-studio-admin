import { fetchEventSource } from '@microsoft/fetch-event-source';
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
import { BASE_URL_API } from '@/constants/api';
import { roleActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';
import { AxiosError } from 'axios';

export function roleCreateThunk(payload: RoleReqCreate): ReduxThunkAction<Promise<RoleApiResCreate | void>> {
    return async function (dispatch, getState) {
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
    return async function (dispatch, getState) {
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
    return async function (dispatch, getState) {
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

export function roleGetThunk(): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/roles`;
        const headers = {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, { method: 'HEAD', headers });

        if (response.status === 401) {
            dispatch(
                toastrActionsCreators.displayToastr({
                    type: 'error',
                    message: 'You are not authorized to view this page.',
                })
            );

            dispatch(roleActionsCreators.resetRole());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(roleActionsCreators.setRole(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
