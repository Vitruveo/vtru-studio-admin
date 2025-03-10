import axios from 'axios';
import store from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { APIResponse } from '../common/types';
import {
    GetStoresPaginatedParams,
    GetStoresPaginatedResponse,
    UpdateStoreStatusParams,
    UpdateStoresSpotlightParams,
} from './types';
import { apiService } from '@/services/api';

export const getStoresPaginated = (params: GetStoresPaginatedParams) => {
    return axios.get<APIResponse<GetStoresPaginatedResponse>>(`${BASE_URL_API}/stores`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
};

export const updateStoreStatus = (params: UpdateStoreStatusParams) => {
    return apiService.patch(`/stores/status/${params.id}`, { status: params.status });
};

export const updateStoresSpotlight = (params: UpdateStoresSpotlightParams) => {
    return apiService.patch(`/stores/spotlight/${params.id}`, { spotlight: params.spotlight });
};
