import { fetchEventSource } from '@microsoft/fetch-event-source';
import { AxiosError } from 'axios';
import { userAddReq, userUpdateReq, userDeleteReq, getUsersPaginated } from './requests';
import {
    GetUsersPaginatedParams,
    GetUsersPaginatedResponse,
    UserAddApiRes,
    UserAddReq,
    UserApiResDelete,
    UserApiResUpdate,
    UserDeleteReq,
    UserUpdateReq,
} from './types';
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

export function userGetPaginatedThunk(
    params: GetUsersPaginatedParams
): ReduxThunkAction<Promise<GetUsersPaginatedResponse>> {
    return async function () {
        const response = await getUsersPaginated(params);
        return response.data.data!;
    };
}
