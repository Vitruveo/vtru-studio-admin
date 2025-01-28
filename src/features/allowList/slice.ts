import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AllowItem, AllowListSliceState } from './types';

const initialState: AllowListSliceState = {
    byId: {},
    allIds: [],
    getData: true,
    status: '',
    error: '',
};

export const allowListSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        changeGetData: (state) => {
            state.getData = !state.getData;
        },
        setAllowLists: (state, action: PayloadAction<AllowItem[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: AllowItem }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
        },
        setAllowList: (state, action: PayloadAction<AllowItem>) => {
            state.byId = {
                ...state.byId,
                [action.payload._id]: action.payload,
            };
            state.allIds = Object.keys(state.byId);
        },
        removeAllowList: (state, action: PayloadAction<string>) => {
            delete state.byId[action.payload];
            state.allIds = Object.keys(state.byId);
        },
        resetAllowList: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const allowListActionsCreators = allowListSlice.actions;
