// websocketSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { WebsocketSliceState } from './types';

const initialState: WebsocketSliceState = {
  connection: null,
  messages: [],
};

export const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnected: (state, action) => {
      state.connection = action.payload;
    },
    websocketAddMessage: (state, action) => {
      if (!state.messages.includes(action.payload)) state.messages.push(action.payload);
    },
    websocketRemoveMessage: (state, action) => {
      state.messages = state.messages.filter((item) => item !== action.payload);
    },
    websocketClearMessages: (state) => {
      state.messages = [];
    },
    websocketDisconnected: (state) => {
      state.connection = null;
    },
  },
});

export const websocketActionsCreators = websocketSlice.actions;
