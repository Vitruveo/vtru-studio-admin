import { ReduxThunkAction } from '@/store';
import { GetStoresPaginatedParams, GetStoresPaginatedResponse } from './types';
import { getStoresPaginated } from './requests';

export function getStoresPaginatedThunk(
    params: GetStoresPaginatedParams
): ReduxThunkAction<Promise<GetStoresPaginatedResponse>> {
    return async function(_dispatch) {
        const response = await getStoresPaginated(params);

        return response.data.data!;
    };
}
