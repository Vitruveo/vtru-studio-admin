import { AxiosError } from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { waitingListActionsCreators } from './slice';
import { BASE_URL_API } from '@/constants/api';
import { toastrActionsCreators } from '../toastr/slice';
import { addMultipleWaitingList } from './requests';

export function addMultipleWaitingListThunk(data: any): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        try {
            await addMultipleWaitingList(data);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        message: 'Unauthorized',
                        type: 'error',
                    })
                );
            }
        }
    };
}

export function getWaitingListThunk(): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/waitingList`;
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

            dispatch(waitingListActionsCreators.resetWaitingList());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(waitingListActionsCreators.setWaitingList(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
