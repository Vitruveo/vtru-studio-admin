import { ReduxThunkAction } from '@/store';
import { GetStoresPaginatedParams, GetStoresPaginatedResponse, UpdateStoreStatusParams } from './types';
import { getStoresPaginated, updateStoreStatus } from './requests';

export function getStoresPaginatedThunk(
    params: GetStoresPaginatedParams
): ReduxThunkAction<Promise<GetStoresPaginatedResponse>> {
    return async function (_dispatch) {
        const response = await getStoresPaginated(params);

        return response.data.data!;
    };
}

export function updateStoreStatusThunk(params: UpdateStoreStatusParams): ReduxThunkAction<Promise<void>> {
    return async function (_dispatch) {
        await updateStoreStatus(params);
    };
}
