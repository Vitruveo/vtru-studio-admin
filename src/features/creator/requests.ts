import axios from 'axios';
import { CreatorType, UpdateVaultStateOptions } from './types';
import { BASE_URL_BATCH } from '@/constants/api';
import { apiService } from '@/services/api';

export async function updateVaultState({ vaultAddress, state }: UpdateVaultStateOptions) {
    return axios.put(`${BASE_URL_BATCH}/vault`, { vaultAddress, state });
}

export function getCreatorById(id: string) {
    return apiService.get<CreatorType>(`/creators/${id}`);
}
