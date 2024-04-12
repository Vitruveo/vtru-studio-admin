import { ReduxThunkAction } from '@/store';
import { getAssetStatusByCreatorId, updateAssetStatusByCreatorId } from './requests';
import { GetAssetStatusByCreatorIdParams, UpdateAssetStatusByCreatorIdParams } from './types';
import { APIResponse } from '../common/types';

export function updateAssetStatusByCreatorByIdThunk(
    payload: UpdateAssetStatusByCreatorIdParams
): ReduxThunkAction<Promise<APIResponse>> {
    return async function () {
        return updateAssetStatusByCreatorId({ creatorId: payload.creatorId, status: payload.status });
    };
}

export function getAssetStatusByCreatorIdThunk(
    payload: GetAssetStatusByCreatorIdParams
): ReduxThunkAction<Promise<APIResponse<string>>> {
    return async function () {
        return getAssetStatusByCreatorId({ creatorId: payload.creatorId });
    };
}
