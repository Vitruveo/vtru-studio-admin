import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, CreatorType } from './types';

const initialState: InitialState = {
    all: []
};

export const creatorSlice = createSlice({
    name: 'creator',
    initialState,
    reducers: {
        push: (state, action: PayloadAction<CreatorType>) => {
            state.all.push(action.payload);
        },
        remove: (state, action: PayloadAction<{ id: string }>) => {
            state.all.filter((item) => item._id !== action.payload.id);
        },
        setAll: (state, action: PayloadAction<CreatorType[]>) => {
            state.all = action.payload;
        }
    }
});

export const creatorActionsCreators = creatorSlice.actions;
