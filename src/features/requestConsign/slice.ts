import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { InitialState, RequestConsign } from './types';

const initialState: InitialState = {
    byId: {},
    allIds: [],
    status: '',
    error: '',
};

export const requestConsignSlice = createSlice({
    name: 'requestConsign',
    initialState,
    reducers: {
        setRequestConsign: (state, action: PayloadAction<RequestConsign>) => {
            state.byId[action.payload._id] = action.payload;
            state.allIds = Object.keys(state.byId);
        },
        setRequestConsignStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
            state.byId[action.payload.id] = {
                ...state.byId[action.payload.id],
                status: action.payload.status,
            };
        },
        resetRequestConsign: (state) => {
            state.byId = {};
            state.allIds = [];
        },
        setTransaction: (state, action: PayloadAction<{ id: string; transaction: string }>) => {
            state.byId[action.payload.id] = {
                ...state.byId[action.payload.id],
                transaction: action.payload.transaction,
            };
        },
        setLogs: (
            state,
            action: PayloadAction<{
                id: string;
                logs: {
                    status: string;
                    message: string;
                    when: string;
                }[];
            }>
        ) => {
            state.byId[action.payload.id] = {
                ...state.byId[action.payload.id],
                logs: action.payload.logs,
            };
        },
        resetConsign: (state, action: PayloadAction<{ id: string }>) => {
            state.byId[action.payload.id] = {
                ...state.byId[action.payload.id],
                transaction: undefined,
                logs: undefined,
            };
        },
    },
});

export const requestConsignActionsCreators = requestConsignSlice.actions;