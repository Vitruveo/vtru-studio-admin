import { apiService } from '@/services/api';
import type { UpdateAssetStatusByIdParams } from './types';

export async function updateAssetStatusById({ id, status }: UpdateAssetStatusByIdParams) {
    return apiService.put(`/assets/${id}/status`, { status });
}
