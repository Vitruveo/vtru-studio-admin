import { userLoginReq, userOTPConfimReq } from './requests';
import { UserLoginApiRes, UserLoginReq, UserOTPConfirmApiRes, UserOTPConfirmReq } from './types';
import { ReduxThunkAction } from '@/store';
import { userActionsCreators } from './slice';

export function userLoginThunk(payload: UserLoginReq): ReduxThunkAction<Promise<UserLoginApiRes>> {
    return async function (dispatch, getState) {
        const response = await userLoginReq({ email: payload.email });

        dispatch(userActionsCreators.login({ email: payload.email }));

        return response;
    };
}

export function userOTPConfirmThunk(payload: UserOTPConfirmReq): ReduxThunkAction<Promise<UserOTPConfirmApiRes>> {
    return async function (dispatch, getState) {
        const response = await userOTPConfimReq({ email: payload.email, code: payload.code });
        dispatch(userActionsCreators.otpConfirm(response));

        return response;
    };
}
