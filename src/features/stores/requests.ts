import axios from 'axios';
import store from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { APIResponse } from '../common/types';
import { GetStoresPaginatedParams, GetStoresPaginatedResponse } from './types';

export const getStoresPaginated = (params: GetStoresPaginatedParams) => {
    return axios.get<APIResponse<GetStoresPaginatedResponse>>(`${BASE_URL_API}/stores`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
};
