import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { userAddThunk, userDeleteThunk, userUpdateThunk } from './thunks';
import { UserSliceState, User } from './types';

const initialState: UserSliceState = {
    byId: {},
    allIds: [],
    error: '',
    status: '',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state = initialState;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.byId[action.payload._id] = action.payload;
            state.allIds = Object.keys(state.byId);
        },
        resetUser: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const userActionsCreators = userSlice.actions;
export { userAddThunk, userDeleteThunk, userUpdateThunk };
