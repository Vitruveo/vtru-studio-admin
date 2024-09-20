import { AxiosError } from 'axios';

import { ReduxThunkAction } from '@/store';
import {
    getAssetsByCreatorId,
    getCreatorNameByAssetId,
    getAssetById,
    updateAssetStatusById,
    updateManyAssetsStatusByIds,
    updateAssetsNudity,
    getAssetsPaginated,
} from './requests';
import type {
    ChangeFilterParams,
    GetAssetsByCreatorIdResponse,
    GetAssetsPaginatedParams,
    GetCreatorNameByAssetIdParams,
    UpdateAssetStatusByIdParams,
    UpdateAssetsNudityParams,
    UpdateManyAssetsStatusByIdsParams,
} from './types';
import { APIResponse } from '../common/types';
import { assetActionsCreators } from './slice';
import { toastrActionsCreators } from '../toastr/slice';

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

export function getAssetsPaginatedThunk(
    params: GetAssetsPaginatedParams
): ReduxThunkAction<Promise<GetAssetsByCreatorIdResponse>> {
    return async function (dispatch) {
        const response = await getAssetsPaginated(params);

        return response.data.data!;
    };
}

export function updateManyAssetsStatusByIdsThunk(payload: UpdateManyAssetsStatusByIdsParams): ReduxThunkAction {
    return async function (dispatch) {
        try {
            await updateManyAssetsStatusByIds(payload);
            // dispatch(assetActionsCreators.setManyStatus(payload));
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

export function setPageThunk(payload: number): ReduxThunkAction {
    return function (dispatch) {
        dispatch(assetActionsCreators.setPage(payload));
    };
}

export function getAssetByIdThunk(id: string): ReduxThunkAction {
    return async function (dispatch, getState) {
        const response = await getAssetById(id);

        if (response.data) dispatch(assetActionsCreators.setAsset(response.data));
    };
}

export const getAssetsByCreatorIdThunk =
    (creatorId: string, page?: number): ReduxThunkAction =>
    async (dispatch) => {
        const response = await getAssetsByCreatorId(creatorId, page);

        if (response.data) {
            dispatch(assetActionsCreators.setAssets(response.data.data));
            dispatch(assetActionsCreators.setTotal(response.data.total));
            dispatch(assetActionsCreators.setTotalPage(response.data.totalPage));
        }
    };

export const updateAssetsNudityThunk = (data: UpdateAssetsNudityParams): ReduxThunkAction => {
    return async function (dispatch) {
        try {
            await updateAssetsNudity(data);
            dispatch(
                toastrActionsCreators.displayToastr({
                    type: 'success',
                    message: 'Assets nudity updated successfully.',
                })
            );
        } catch (e) {
            // Handle error
        }
    };
};
