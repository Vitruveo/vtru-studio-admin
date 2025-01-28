import { AxiosError } from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ReduxThunkAction } from '@/store';
import { allowListActionsCreators } from './slice';
import { BASE_URL_API } from '@/constants/api';
import { toastrActionsCreators } from '../toastr/slice';
import { addMultipleAllowList } from './requests';

export function addMultipleAllowListThunk(data: any): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        try {
            await addMultipleAllowList(data);
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

export function getAllowListThunk(): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/allowList`;
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

            dispatch(allowListActionsCreators.resetAllowList());

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                console.log({ message });
                dispatch(allowListActionsCreators.setAllowList(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}
