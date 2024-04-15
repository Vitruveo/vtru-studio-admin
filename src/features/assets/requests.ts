import { apiService } from '@/services/api';
import type { GetAssetStatusByCreatorIdParams, UpdateAssetStatusByCreatorIdParams } from './types';

export async function updateAssetStatusByCreatorId({ creatorId, status }: UpdateAssetStatusByCreatorIdParams) {
    return apiService.put(`/assets/${creatorId}/status`, {
        status,
    });
}

export async function getAssetStatusByCreatorId({ creatorId }: GetAssetStatusByCreatorIdParams) {
    return apiService.get<string>(`/assets/${creatorId}/status`);
}
