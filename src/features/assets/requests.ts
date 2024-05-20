import { apiService } from '@/services/api';
import type { GetCreatorNameByAssetIdParams, UpdateAssetStatusByIdParams } from './types';

export function updateAssetStatusById({ id, status }: UpdateAssetStatusByIdParams) {
    return apiService.put(`/assets/${id}/status`, { status });
}

export function getCreatorNameByAssetId({ id }: GetCreatorNameByAssetIdParams) {
    return apiService.get<{ username: string }>(`/assets/public/${id}`);
}

export function updateManyAssetsStatusByIds({ ids, status }: { ids: string[]; status: 'active' | 'blocked' }) {
    return apiService.put(`/assets/status`, { ids, status });
}
