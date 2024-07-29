import cookie from 'cookiejs';
import { userLoginReq, userOTPConfimReq } from './requests';
import { UserLoginApiRes, UserLoginReq, UserOTPConfirmApiRes, UserOTPConfirmReq } from './types';
import { ReduxThunkAction } from '@/store';
import { userActionsCreators } from './slice';
import { connectWebSocketThunk, loginWebSocketThunk } from '../ws';
import { toastrActionsCreators } from '../toastr/slice';

export function setCookieThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;
        const replaceDomain = window.location.hostname.includes('vitruveo.xyz') ? 'studio-admin.' : 'admin.';

        const domain = window.location.hostname.replace(replaceDomain, '');
        cookie.set('token', token, { path: '/', domain });
    };
}

export function userLoginThunk(payload: UserLoginReq): ReduxThunkAction<Promise<UserLoginApiRes>> {
    return async function (dispatch, getState) {
        const response = await userLoginReq({ email: payload.email });

        dispatch(userActionsCreators.login({ email: payload.email }));

        return response;
    };
}

export function userOTPConfirmThunk(payload: UserOTPConfirmReq): ReduxThunkAction<Promise<UserOTPConfirmApiRes>> {
    return async function (dispatch, getState) {
        return userOTPConfimReq({ email: payload.email, code: payload.code })
            .then((response) => {
                dispatch(userActionsCreators.otpConfirm(response));
                dispatch(connectWebSocketThunk());
                dispatch(loginWebSocketThunk());

                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'OTP confirmed!',
                        type: 'success',
                    })
                );

                dispatch(setCookieThunk());

                return response;
            })
            .catch((error) => {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'Login failed: invalid code',
                        type: 'error',
                    })
                );

                throw error;
            });
    };
}
