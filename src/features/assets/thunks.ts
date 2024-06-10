import { AxiosError } from 'axios';
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

export function getAssetsThunk({ ctrl }: { ctrl: AbortController }): ReduxThunkAction {
    return async function (dispatch, getState) {
        const state = getState();
        const token = state.auth.token;

        const url = `${BASE_URL_API}/assets`;
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

            return;
        }

        fetchEventSource(url, {
            method: 'GET',
            headers,
            onmessage(event) {
                const parsed = JSON.parse(event.data) as AssetType;

                if (!state.asset.allIds.includes(parsed._id)) {
                    dispatch(assetActionsCreators.setAllIds(parsed._id));
                    dispatch(assetActionsCreators.setById({ id: parsed._id, asset: parsed }));
                }
            },
            onclose() {
                ctrl.abort();
            },
            onerror() {
                throw new Error('Error fetching event source');
            },
            signal: ctrl.signal,
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

export function setCurrentPageThunk(payload: number): ReduxThunkAction {
    return function (dispatch) {
        dispatch(assetActionsCreators.setCurrentPage(payload));
    };
}
