import { ReduxThunkAction } from '@/store';
import {
    GetStoresPaginatedParams,
    GetStoresPaginatedResponse,
    UpdateStoreStatusParams,
    UpdateStoresSpotlightParams,
} from './types';
import { getStoresPaginated, updateStoreStatus, updateStoresSpotlight } from './requests';

export function getStoresPaginatedThunk(
    params: GetStoresPaginatedParams
): ReduxThunkAction<Promise<GetStoresPaginatedResponse>> {
    return async function(_dispatch) {
        const response = await getStoresPaginated(params);

        return response.data.data!;
    };
}

export function updateStoreStatusThunk(params: UpdateStoreStatusParams): ReduxThunkAction<Promise<void>> {
    return async function(_dispatch) {
        await updateStoreStatus(params);
    };
}

export function updateStoresSpotlightThunk(params: UpdateStoresSpotlightParams): ReduxThunkAction<Promise<void>> {
    return async function(_dispatch) {
        await updateStoresSpotlight(params);
    };
}
