import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, CreatorType } from './types';

const initialState: InitialState = {
    byId: {},
    allIds: [],
    error: '',
    status: '',
};

export const creatorSlice = createSlice({
    name: 'creator',
    initialState,
    reducers: {
        setCreator: (state, action: PayloadAction<CreatorType>) => {
            state.byId = {
                ...state.byId,
                [action.payload._id]: action.payload,
            };
            state.allIds = Object.keys(state.byId);
        },
        removeCreator: (state, action: PayloadAction<{ id: string }>) => {
            delete state.byId[action.payload.id];
            state.allIds = Object.keys(state.byId);
        },
        resetCreator: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const creatorActionsCreators = creatorSlice.actions;
