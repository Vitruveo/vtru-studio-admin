import { AxiosError } from 'axios';

import { ReduxThunkAction } from '@/store';
import { requestConsignActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';
import {
    consign,
    eventsByTransaction,
    getRequestConsigns,
    updateRequestConsignComments,
    updateRequestConsignCommentVisibility,
    updateStatusRequestConsign,
} from './requests';
import { APIResponse } from '../common/types';
import {
    GetRequestConsigns,
    RequestConsignAddComment,
    RequestConsignPaginatedResponse,
    RequestConsignUpdateCommentVisibility,
} from './types';

export function requestConsignUpdateStatusThunk(
    id: string,
    status: 'approved' | 'rejected' | 'running' | 'draft' | 'canceled'
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

export function requestConsignGetThunk({
    status,
    page,
    search,
}: GetRequestConsigns): ReduxThunkAction<Promise<APIResponse<RequestConsignPaginatedResponse>>> {
    return async function (dispatch, getState) {
        dispatch(requestConsignActionsCreators.setStartLoading());
        return getRequestConsigns({ status, page, search }).finally(() => {
            dispatch(requestConsignActionsCreators.setFinishLoading());
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

        return consign(requestConsign.asset._id)
            .then((response) => {
                dispatch(requestConsignActionsCreators.resetConsign({ id: requestId }));
            })
            .catch((error) => {
                if (error instanceof AxiosError && error.response?.status === 400) {
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            message: 'Consign already exists',
                            type: 'warning',
                        })
                    );

                    dispatch(
                        requestConsignActionsCreators.setRequestConsignStatus({
                            id: requestId,
                            status: 'approved',
                        })
                    );
                }
            });
    };
}

export function eventTransactionThunk({ requestId }: { requestId: string }): ReduxThunkAction<Promise<void>> {
    return function (dispatch, getState) {
        const transaction = getState().requestConsign.byId[requestId].transaction;
        if (!transaction) {
            const logs = getState().requestConsign.byId[requestId].logs || [];
            dispatch(requestConsignActionsCreators.setLogs({ id: requestId, logs }));
            dispatch(requestConsignActionsCreators.setRequestConsignStatus({ id: requestId, status: 'error' }));
            return Promise.resolve();
        }

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

            const lastLog = logs[logs.length - 1] || { status: 'pending' };

            if (logs.length > 0)
                dispatch(
                    requestConsignActionsCreators.setLogs({
                        id: requestId,
                        logs,
                    })
                );

            if (lastLog.status === CONSIGN_STATUS_MAP.failed) {
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

            if (lastLog.status === CONSIGN_STATUS_MAP.finished) {
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

            if (lastLog.status === CONSIGN_STATUS_MAP.pending || lastLog.status === CONSIGN_STATUS_MAP.running) {
                setTimeout(() => {
                    dispatch(eventTransactionThunk({ requestId }));
                }, 1_000);
            }
        });
    };
}

export function requestConsignAddCommentThunk({
    id,
    comment,
}: RequestConsignAddComment): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        updateRequestConsignComments({ id, comment })
            .then((res) => {
                // do nothing
            })
            .catch(() => {
                // do nothing
            });
    };
}

export function requestConsignUpdateCommentVisibilityThunk({
    id,
    commentId,
    isPublic,
}: RequestConsignUpdateCommentVisibility): ReduxThunkAction<Promise<void>> {
    return async function (dispatch, getState) {
        updateRequestConsignCommentVisibility({ id, commentId, isPublic })
            .then(() => {
                // do nothing
            })
            .catch(() => {
                // do nothing
            });
    };
}
