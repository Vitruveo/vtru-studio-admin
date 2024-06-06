import { fetchEventSource } from '@microsoft/fetch-event-source';
import { AxiosError } from 'axios';
import { userAddReq, userUpdateReq, userDeleteReq } from './requests';
import { UserAddApiRes, UserAddReq, UserApiResDelete, UserApiResUpdate, UserDeleteReq, UserUpdateReq } from './types';
import { ReduxThunkAction } from '@/store';
import { toastrActionsCreators } from '../toastr/slice';
import { BASE_URL_API } from '@/constants/api';
import { userActionsCreators } from './slice';

export function userAddThunk(payload: UserAddReq): ReduxThunkAction<Promise<UserAddApiRes | void>> {
    return async function (dispatch, getState) {
        try {
            const response = await userAddReq({ name: payload.name, login: { email: payload.login.email } });
            dispatch(
                toastrActionsCreators.displayToastr({
                    message: 'User created successfully',
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

export function userUpdateThunk(payload: UserUpdateReq): ReduxThunkAction<Promise<UserApiResUpdate | void>> {
    return async function (dispatch, getState) {
        try {
            const response = await userUpdateReq({
                _id: payload._id,
                name: payload.name,
                emails: payload.emails,
                login: payload.login,
                profile: payload.profile,
                roles: payload.roles,
                framework: payload.framework,
            });
            dispatch(
                toastrActionsCreators.displayToastr({
                    message: 'User updated successfully',
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

export function userDeleteThunk(payload: UserDeleteReq): ReduxThunkAction<Promise<UserApiResDelete | void>> {
    return async function (dispatch, getState) {
        try {
            const response = await userDeleteReq({ _id: payload._id });
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

export function userGetThunk(): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/users`;
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

            dispatch(userActionsCreators.resetUser());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(userActionsCreators.setUser(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
