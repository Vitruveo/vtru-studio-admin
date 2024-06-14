import { AnyAction, combineReducers, Reducer } from '@reduxjs/toolkit';

import { userSlice } from '@/features/user';
import { customizerSlice } from '@/features/customizer';
import { roleSlice } from '@/features/role';
import { websocketSlice } from '@/features/ws';
import { assetSlice } from '@/features/assets/slice';
import { creatorSlice } from '@/features/creator';
import { waitingListSlice } from '@/features/waitingList';
import { toastrSlice } from '@/features/toastr';
import { authSlice } from '@/features/auth';
import { requestConsignSlice } from '@/features/requestConsign';
import { allowListSlice } from '@/features/allowList';

interface RootState {
    asset: ReturnType<typeof assetSlice.reducer>;
    user: ReturnType<typeof userSlice.reducer>;
    customizer: ReturnType<typeof customizerSlice.reducer>;
    role: ReturnType<typeof roleSlice.reducer>;
    websocket: ReturnType<typeof websocketSlice.reducer>;
    creator: ReturnType<typeof creatorSlice.reducer>;
    waitingList: ReturnType<typeof waitingListSlice.reducer>;
    toastr: ReturnType<typeof toastrSlice.reducer>;
    auth: ReturnType<typeof authSlice.reducer>;
    requestConsign: ReturnType<typeof requestConsignSlice.reducer>;
    allowList: ReturnType<typeof allowListSlice.reducer>;
}

export const appReducer = combineReducers({
    asset: assetSlice.reducer,
    user: userSlice.reducer,
    customizer: customizerSlice.reducer,
    role: roleSlice.reducer,
    websocket: websocketSlice.reducer,
    creator: creatorSlice.reducer,
    waitingList: waitingListSlice.reducer,
    toastr: toastrSlice.reducer,
    auth: authSlice.reducer,
    requestConsign: requestConsignSlice.reducer,
    allowList: allowListSlice.reducer,
});

export const reducer: Reducer<RootState, AnyAction> = (state: RootState | undefined, action: AnyAction) => {
    if (state && action.type === 'user/logout') {
        state.websocket.connection?.close();
        state = undefined;
    }

    return appReducer(state, action);
};
