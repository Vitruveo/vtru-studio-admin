import { apiService } from '@/services/api';
import type { GetCreatorNameByAssetIdParams, UpdateAssetStatusByIdParams } from './types';

export async function updateAssetStatusById({ id, status }: UpdateAssetStatusByIdParams) {
    return apiService.put(`/assets/${id}/status`, { status });
}

export async function getCreatorNameByAssetId({ id }: GetCreatorNameByAssetIdParams) {
    return apiService.get<{ username: string }>(`/assets/public/${id}`);
}
