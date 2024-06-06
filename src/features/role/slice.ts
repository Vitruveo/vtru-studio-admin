import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Role, RoleSliceState } from './types';

const initialState: RoleSliceState = {
    byId: {},
    allIds: [],
    status: '',
    error: '',
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<Role>) => {
            state.byId = {
                ...state.byId,
                [action.payload._id]: action.payload,
            };
            state.allIds = Object.keys(state.byId);
        },
        removeRole: (state, action: PayloadAction<string>) => {
            delete state.byId[action.payload];
            state.allIds = Object.keys(state.byId);
        },
        resetRole: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const roleActionsCreators = roleSlice.actions;
