import { AxiosError } from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import cookie from 'cookiejs';

import { ReduxThunkAction } from '@/store';
import { requestConsignActionsCreators } from './slice';
import { BASE_URL_API } from '@/constants/api';
import { toastrActionsCreators } from '../toastr/slice';
import { consign, eventsByTransaction, updateStatusRequestConsign } from './requests';
import { APIResponse } from '../common/types';

export function requestConsignUpdateStatusThunk(
    id: string,
    status: 'approved' | 'rejected' | 'running'
): ReduxThunkAction<Promise<APIResponse | void>> {
    return async function (dispatch, getState) {
        try {
            await updateStatusRequestConsign({ id, status });

            dispatch(
                toastrActionsCreators.displayToastr({
                    message: 'Request consign status updated',
                    type: 'success',
                })
            );

            dispatch(
                requestConsignActionsCreators.setRequestConsignStatus({
                    id,
                    status,
                })
            );
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

export function requestConsignGetThunk(): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const replaceDomain = window.location.hostname.includes('vitruveo.xyz') ? 'studio-admin.' : 'admin.';

        const domain = window.location.hostname.replace(replaceDomain, '');
        cookie.set('token', state.auth.token, { path: '/', domain });

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/requestConsign`;
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

            dispatch(requestConsignActionsCreators.resetRequestConsign());

            return;
        }

        return fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(message) {
                dispatch(requestConsignActionsCreators.setRequestConsign(JSON.parse(message.data)));
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
        });
    };
}

export const CONSIGN_STATUS_MAP = {
    pending: 'pending',
    running: 'running',
    finished: 'finished',
    failed: 'failed',
};

export function consignThunk({ requestId }: { requestId: string }): ReduxThunkAction<Promise<void>> {
    return function (dispatch, getState) {
        const requestConsign = getState().requestConsign.byId[requestId];

        return consign(requestConsign.asset._id).then((response) => {
            dispatch(requestConsignActionsCreators.resetConsign({ id: requestId }));
            consignThunk;
            dispatch(
                requestConsignActionsCreators.setTransaction({ id: requestId, transaction: response.data.transaction })
            );
            dispatch(eventTransactionThunk({ requestId }));
        });
    };
}

export function eventTransactionThunk({ requestId }: { requestId: string }): ReduxThunkAction<Promise<void>> {
    return function (dispatch, getState) {
        const transaction = getState().requestConsign.byId[requestId].transaction;
        if (!transaction) return Promise.resolve();

        return eventsByTransaction(transaction).then((response) => {
            if (!response.data?.data?.history || !response.data?.data?.current) {
                dispatch(
                    toastrActionsCreators.displayToastr({
                        type: 'error',
                        message: 'Error fetching transaction events',
                    })
                );

                return;
            }

            const logs = response.data.data.history || [];

            if (!logs.some((item: { status: string }) => item.status === response.data.data.current.status)) {
                logs.push(response.data.data.current);
            }

            dispatch(
                requestConsignActionsCreators.setLogs({
                    id: requestId,
                    logs,
                })
            );

            if (response.data.data.current.status === CONSIGN_STATUS_MAP.failed) {
                dispatch(
                    requestConsignActionsCreators.setRequestConsignStatus({
                        id: requestId,
                        status: 'error',
                    })
                );
                updateStatusRequestConsign({ id: requestId, status: 'error', logs }).catch(() => {
                    // do nothing
                });
            }

            if (response.data.data.current.status === CONSIGN_STATUS_MAP.finished) {
                dispatch(
                    requestConsignActionsCreators.setRequestConsignStatus({
                        id: requestId,
                        status: 'approved',
                    })
                );
                updateStatusRequestConsign({ id: requestId, status: 'approved', logs }).catch(() => {
                    // do nothing
                });
            }

            if (
                response.data.data.current.status === CONSIGN_STATUS_MAP.pending ||
                response.data.data.current.status === CONSIGN_STATUS_MAP.running
            ) {
                setTimeout(() => {
                    dispatch(eventTransactionThunk({ requestId }));
                }, 1_000);
            }
        });
    };
}
