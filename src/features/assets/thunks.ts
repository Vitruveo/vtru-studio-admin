import { fetchEventSource } from '@microsoft/fetch-event-source';

import { ReduxThunkAction } from '@/store';
import { updateAssetStatusById } from './requests';
import type { ChangeFilterParams, UpdateAssetStatusByIdParams } from './types';
import { APIResponse } from '../common/types';
import { assetActionsCreators } from './slice';
import { BASE_URL_API } from '@/constants/api';

export function getAssetsThunk(): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.user.token;

        const ctrl = new AbortController();

        const url = `${BASE_URL_API}/assets`;
        const headers = {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
        };

        return fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(event) {
                const parsed = JSON.parse(event.data);

                if (!state.asset.allIds.includes(parsed._id)) {
                    dispatch(assetActionsCreators.setAllIds(parsed._id));
                    dispatch(assetActionsCreators.setById({ id: parsed._id, asset: parsed }));
                }
            },
            signal: ctrl.signal,
            onclose() {
                ctrl.abort();
            },
            onerror() {
                ctrl.abort();
            },
        });
    };
}

export function updateAssetStatusByIdThunk(
    payload: UpdateAssetStatusByIdParams
): ReduxThunkAction<Promise<APIResponse>> {
    return async function (dispatch) {
        dispatch(
            assetActionsCreators.setStatus({
                id: payload.id,
                status: payload.status,
            })
        );

        return updateAssetStatusById(payload);
    };
}

export function changeFilterThunk(payload: ChangeFilterParams): ReduxThunkAction {
    return async function (dispatch) {
        dispatch(assetActionsCreators.changeFilter(payload));
    };
}
