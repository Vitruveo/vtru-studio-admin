import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, WaitingItem } from './types';

const initialState: InitialState = {
    byId: {},
    allIds: [],
    status: '',
    error: '',
};

export const waitingListSlice = createSlice({
    name: 'waitingList',
    initialState,
    reducers: {
        setWaitingLists: (state, action: PayloadAction<WaitingItem[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: WaitingItem }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
        },
        setWaitingList: (state, action: PayloadAction<WaitingItem>) => {
            state.byId[action.payload._id] = action.payload;
            state.allIds = Object.keys(state.byId);
        },
        resetWaitingList: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const waitingListActionsCreators = waitingListSlice.actions;
