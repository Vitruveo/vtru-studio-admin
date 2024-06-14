import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { ChangeFilterParams, InitialState, UpdateManyAssetsStatusByIdsParams } from './types';
import { AssetType } from '@/app/home/types/apps/asset';

const initialState: InitialState = {
    byId: {},
    allIds: [],
    creator: '',
    filter: 'all',
    currentPage: 1,
};

export const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        setAssets: (state, action: PayloadAction<AssetType[]>) => {
            state.byId = action.payload.reduce<{ [key: string]: AssetType }>((acc, cur) => {
                acc[cur._id] = cur;
                return acc;
            }, {});
            state.allIds = Object.keys(state.byId);
        },
        setAsset: (state, action: PayloadAction<AssetType>) => {
            state.byId[action.payload._id] = action.payload;
            state.allIds = Object.keys(state.byId);
        },
        setStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
            state.byId[action.payload.id].consignArtwork.status = action.payload.status;
        },
        setById: (state, action: PayloadAction<{ id: string; asset: AssetType }>) => {
            state.byId[action.payload.id] = action.payload.asset;
        },
        setAllIds: (state, action: PayloadAction<string>) => {
            if (!state.allIds.includes(action.payload)) {
                state.allIds.push(action.payload);
            }
        },
        changeFilter: (state, action: PayloadAction<ChangeFilterParams>) => {
            state.filter = action.payload;
        },
        changeCreator: (state, action: PayloadAction<string>) => {
            state.creator = action.payload;
        },
        setManyStatus: (state, action: PayloadAction<UpdateManyAssetsStatusByIdsParams>) => {
            action.payload.ids.forEach((id) => {
                state.byId[id].consignArtwork.status = action.payload.status;
            });
        },
        resetAsset: (state) => {
            state.byId = {};
            state.allIds = [];
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
});

export const assetActionsCreators = assetSlice.actions;
