import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, WaitingItem } from './types';

const initialState: InitialState = {
    all: [],
};

export const waitingListSlice = createSlice({
    name: 'waitingList',
    initialState,
    reducers: {
        setAll: (state, action: PayloadAction<WaitingItem[]>) => {
            state.all = action.payload;
        },
    },
});

export const waitingListActionsCreators = waitingListSlice.actions;
