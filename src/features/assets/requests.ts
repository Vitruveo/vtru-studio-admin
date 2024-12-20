import axios from 'axios';
import { apiService } from '@/services/api';
import type {
    GetAssetsArtCardsResponse,
    UpdateAssetArtCardsParams,
    GetAssetsArtCardsParams,
    GetAssetsByCreatorIdResponse,
    GetAssetsPaginatedParams,
    GetCreatorNameByAssetIdParams,
    UpdateAssetStatusByIdParams,
    UpdateAssetsNudityParams,
} from './types';
import { AssetPaginated, AssetType } from '@/app/home/types/apps/asset';
import store from '@/store';
import { BASE_URL_API } from '@/constants/api';
import { APIResponse } from '../common/types';

export function updateAssetStatusById({ id, status }: UpdateAssetStatusByIdParams) {
    return apiService.put(`/assets/${id}/status`, { status });
}

export function getCreatorNameByAssetId({ id }: GetCreatorNameByAssetIdParams) {
    return apiService.get<{ username: string }>(`/assets/public/${id}`);
}

export function updateManyAssetsStatusByIds({ ids, status }: { ids: string[]; status: 'active' | 'blocked' }) {
    return apiService.put(`/assets/status`, { ids, status });
}

export const getAssetById = (id: string) => {
    return apiService.get<AssetType>(`/assets/${id}`);
};

export const getAssetsByCreatorId = (creatorId: string, page?: number) => {
    return apiService.get<AssetPaginated>(`/assets?creatorId=${creatorId}&page=${page ?? 1}`);
};

export const updateAssetsNudity = ({ ids, nudity }: UpdateAssetsNudityParams) => {
    return apiService.put(`/assets/nudity`, { ids, nudity });
};

export const getAssetsPaginated = (params: GetAssetsPaginatedParams) => {
    return axios.get<APIResponse<GetAssetsByCreatorIdResponse>>(`${BASE_URL_API}/assets/admin`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
};

export const getAssetsArtCards = (params: GetAssetsArtCardsParams) => {
    return axios.get<APIResponse<GetAssetsArtCardsResponse>>(`${BASE_URL_API}/assets/artCards`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
};

export const updateAssetArtCards = (params: UpdateAssetArtCardsParams) => {
    return axios.patch(
        `${BASE_URL_API}/assets/artCards/${params.id}`,
        { status: params.status },
        {
            headers: {
                Authorization: `Bearer ${store.getState().auth.token}`,
            },
        }
    );
};
