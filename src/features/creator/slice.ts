import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, CreatorType } from './types';

const initialState: InitialState = {
    byId: {},
    allIds: [],
    error: '',
    status: '',
    loadingTrusted: false,
};

export const creatorSlice = createSlice({
    name: 'creator',
    initialState,
    reducers: {
        setCreators: (state, action: PayloadAction<CreatorType[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: CreatorType }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
        },
        setCreator: (state, action: PayloadAction<CreatorType>) => {
            state.byId = {
                ...state.byId,
                [action.payload._id]: action.payload,
            };
            state.allIds = Object.keys(state.byId);
        },
        setVaultIsBlockedById: (state, action: PayloadAction<{ id: string; isBlocked: boolean }>) => {
            state.byId[action.payload.id].vault.isBlocked = action.payload.isBlocked;
        },
        setVaultIsTrustedById: (state, action: PayloadAction<{ id: string; isTrusted: boolean }>) => {
            state.byId[action.payload.id].vault.isTrusted = action.payload.isTrusted;
        },
        removeCreator: (state, action: PayloadAction<{ id: string }>) => {
            delete state.byId[action.payload.id];
            state.allIds = Object.keys(state.byId);
        },
        setStatus: (state, action: PayloadAction<InitialState['status']>) => {
            state.status = action.payload;
        },
        setLoadingTrusted: (state, action: PayloadAction<boolean>) => {
            state.loadingTrusted = action.payload;
        },
        resetCreator: (state) => {
            state.byId = {};
            state.allIds = [];
        },
    },
});

export const creatorActionsCreators = creatorSlice.actions;
