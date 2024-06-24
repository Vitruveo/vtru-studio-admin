import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { CommentsProps, InitialState, RequestConsign } from './types';

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
        setRequestConsigns: (state, action: PayloadAction<RequestConsign[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: RequestConsign }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
        },
        setRequestConsign: (state, action: PayloadAction<RequestConsign | { id: string }>) => {
            if ('_id' in action.payload) {
                state.byId[action.payload._id] = action.payload;
                state.allIds = Object.keys(state.byId);
            }
            if ('id' in action.payload) {
                const { id } = action.payload as { id: string };
                state.allIds = state.allIds.filter((deletedId) => deletedId !== id);
            }
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
        setComments: (
            state,
            action: PayloadAction<{
                id: string;
                comments: CommentsProps[];
            }>
        ) => {
            state.byId[action.payload.id] = {
                ...state.byId[action.payload.id],
                comments: action.payload.comments,
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
