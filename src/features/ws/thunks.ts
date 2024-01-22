import { io } from 'socket.io-client';

import { websocketSlice } from '.';

import { TOKEN_ADMINS, WS_SERVER_URL } from '@/constants/ws';
import { ReduxThunkAction } from '@/store';

export function connectWebSocketThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const socket = io(WS_SERVER_URL);

        dispatch(websocketSlice.actions.websocketConnected(socket));
    };
}

export function loginWebSocketThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const socket = getState().websocket.connection!;
        const user = getState().user;

        socket.emit('login', {
            id: user._id,
            token: TOKEN_ADMINS,
        });
    };
}

export function subscribeWebSocketThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const socket = getState().websocket.connection!;

        socket?.on('monitorCreators', (data) => {
            if (data.event === 'connect') {
                dispatch(
                    websocketSlice.actions.websocketAddMessage({
                        _id: data.id,
                        email: data.email,
                    })
                );
            } else {
                dispatch(websocketSlice.actions.websocketRemoveMessage(data.id));
            }
        });
        socket?.emit('subscribeCreatorsOnline');
    };
}

export function unsubscribeWebSocketThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const socket = getState().websocket.connection!;

        socket?.emit('unsubscribeCreatorsOnline');
        dispatch(websocketSlice.actions.websocketClearMessages());
    };
}
