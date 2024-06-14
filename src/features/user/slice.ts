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
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: User }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
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
