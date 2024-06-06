import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { creatorActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';

export function getCreatorsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/creators`;
        const headers = {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
        };

        const response = await fetch(url, { method: 'HEAD', headers });

        if (response.status === 401) {
            dispatch(
                toastrActionsCreators.displayToastr({
                    type: 'error',
                    message: 'You are not authorized to view this page.',
                })
            );

            dispatch(creatorActionsCreators.resetCreator());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(creatorActionsCreators.setCreator(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}

export function deleteCreatorThunk(id: string): ReduxThunkAction {
    return async function (dispatch, getState) {
        return new Promise((resolve) => {
            dispatch(creatorActionsCreators.removeCreator({ id }));
            resolve();
        });
    };
}
