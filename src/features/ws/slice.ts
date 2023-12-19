import { createSlice } from '@reduxjs/toolkit';
import { WebsocketSliceState } from './types';

const initialState: WebsocketSliceState = {
  connection: null,
  creatorsOnline: [],
};

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnected: (state, action) => {
      state.connection = action.payload;
    },
    websocketAddMessage: (state, action) => {
      if (!state.creatorsOnline.some((item) => item._id === action.payload._id))
        state.creatorsOnline.push(action.payload);
    },
    websocketRemoveMessage: (state, action) => {
      state.creatorsOnline = state.creatorsOnline.filter((item) => item._id !== action.payload);
    },
    websocketClearMessages: (state) => {
      state.creatorsOnline = [];
    },
    websocketDisconnected: (state) => {
      state.connection = null;
    },
  },
});

export const websocketActionsCreators = websocketSlice.actions;
