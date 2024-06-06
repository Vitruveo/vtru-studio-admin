import { createSlice } from '@reduxjs/toolkit';

import { userLoginThunk, userOTPConfirmThunk } from './thunks';
import { AuthSliceState } from './types';

const initialState: AuthSliceState = {
    _id: '',
    name: '',
    emails: [],
    login: {
        email: '',
    },
    profile: {
        avatar: null,
        phone: null,
        language: null,
        location: null,
    },
    roles: [],
    permissions: [],
    token: '',
    status: '',
    error: '',
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.status = '';
            state._id = '';
            state.name = '';
            state.emails = [];
            state.login.email = '';
            state.profile.avatar = null;
            state.profile.phone = null;
            state.profile.language = null;
            state.profile.location = null;
            state.roles = [];
            state.token = '';
            state.error = '';
        },
        login: (state, action) => {
            state.status = 'succeeded';
            state.login.email = action.payload.email;
        },
        otpConfirm: (state, action) => {
            state.status = 'succeeded';
            state.token = action.payload.data.token;
            state._id = action.payload.data.user._id;
            state.emails = action.payload.data.user.emails;
            state.permissions = action.payload.data.permissions;
        },
        error: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
    },
});

export const userActionsCreators = authSlice.actions;
export { userOTPConfirmThunk, userLoginThunk };
