import { apiService } from '@/services/api';
import type { GetCreatorNameByAssetIdParams, UpdateAssetStatusByIdParams } from './types';
import { AssetType } from '@/app/home/types/apps/asset';

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

export const getAssetsByCreatorId = (creatorId: string) => {
    return apiService.get<AssetType[]>(`/assets?creatorId=${creatorId}`);
};
