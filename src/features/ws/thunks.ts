// actions.js
import { CombinedState, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

import { websocketSlice } from '.';
import { WebsocketSliceState } from './types';

export const connectWebSocketThunk = createAsyncThunk<void, undefined>('websocket/connect', async (_, { dispatch }) => {
  const WS_SERVER_URL = `ws://localhost:${3000}`;
  const socket = io(WS_SERVER_URL);

  dispatch(websocketSlice.actions.websocketConnected(socket));
});

export const loginWebSocketThunk = createAsyncThunk<void, { _id: string }>(
  'websocket/login',
  async ({ _id }, { getState }) => {
    const socket = (
      getState() as CombinedState<{
        websocket: WebsocketSliceState;
      }>
    ).websocket.connection!;

    socket.emit('login', {
      id: _id,
      token: 'admin',
    });
  },
);

export const subscribeWebSocketThunk = createAsyncThunk<void, undefined>(
  'websocket/subscribe',
  async (_, { getState, dispatch }) => {
    const socket = (
      getState() as CombinedState<{
        websocket: WebsocketSliceState;
      }>
    ).websocket.connection!;

    socket.on('monitorCreators', (data) => {
      if (data.event === 'connect') {
        dispatch(
          websocketSlice.actions.websocketAddMessage({
            _id: data.id,
            email: data.email,
          }),
        );
      } else {
        dispatch(websocketSlice.actions.websocketRemoveMessage(data.id));
      }
    });
    socket.emit('subscribeCreatorsOnline');
  },
);

export const unsubscribeWebSocketThunk = createAsyncThunk<void, undefined>(
  'websocket/unsubscribe',
  async (_, { getState, dispatch }) => {
    const socket = (
      getState() as CombinedState<{
        websocket: WebsocketSliceState;
      }>
    ).websocket.connection!;

    socket.emit('unsubscribeCreatorsOnline');
    dispatch(websocketSlice.actions.websocketClearMessages());
  },
);
