import { fetchEventSource } from '@microsoft/fetch-event-source';

import { ReduxThunkAction } from '@/store';
import { getCreatorNameByAssetId, updateAssetStatusById, updateManyAssetsStatusByIds } from './requests';
import type {
    ChangeFilterParams,
    GetCreatorNameByAssetIdParams,
    UpdateAssetStatusByIdParams,
    UpdateManyAssetsStatusByIdsParams,
} from './types';
import { APIResponse } from '../common/types';
import { assetActionsCreators } from './slice';
import { BASE_URL_API } from '@/constants/api';
import { AssetType } from '@/app/home/types/apps/asset';
import { toastrActionsCreators } from '../toastr/slice';
import { AxiosError } from 'axios';

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
                const parsed = JSON.parse(event.data) as AssetType;

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
    return function (dispatch) {
        dispatch(
            assetActionsCreators.setStatus({
                id: payload.id,
                status: payload.status,
            })
        );

        return updateAssetStatusById(payload);
    };
}

export function updateManyAssetsStatusByIdsThunk(payload: UpdateManyAssetsStatusByIdsParams): ReduxThunkAction {
    return async function (dispatch) {
        try {
            await updateManyAssetsStatusByIds(payload);
            dispatch(assetActionsCreators.setManyStatus(payload));
            dispatch(
                toastrActionsCreators.displayToastr({
                    type: 'success',
                    message: 'Assets status updated successfully.',
                })
            );
        } catch (e) {
            const { response } = e as AxiosError;
            switch (response?.status) {
                case 401:
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            type: 'error',
                            message: 'You are not authorized to perform this action.',
                        })
                    );
                    break;
                default:
                    dispatch(
                        toastrActionsCreators.displayToastr({
                            type: 'error',
                            message: 'An error occurred while updating the assets status.',
                        })
                    );
                    break;
            }
        }
    };
}

export function changeFilterThunk(payload: ChangeFilterParams): ReduxThunkAction {
    return function (dispatch) {
        dispatch(assetActionsCreators.changeFilter(payload));
    };
}

export function getCreatorNameByAssetIdThunk(payload: GetCreatorNameByAssetIdParams): ReduxThunkAction {
    return function (dispatch) {
        dispatch(assetActionsCreators.changeCreator(''));

        getCreatorNameByAssetId(payload).then((response) => {
            if (!response.data) return;

            dispatch(assetActionsCreators.changeCreator(response.data.username));
        });
    };
}
