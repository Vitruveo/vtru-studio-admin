import axios from 'axios';
import {
    CreatorType,
    GetCreatorsPaginatedParams,
    GetCreatorsPaginatedResponse,
    UpdateLicenseOptions,
    UpdateVaultStateOptions,
} from './types';
import { BASE_URL_API, BASE_URL_BATCH } from '@/constants/api';
import { apiService } from '@/services/api';
import { APIResponse } from '../common/types';
import store from '@/store';

export async function updateVaultState({ vaultAddress, state }: UpdateVaultStateOptions) {
    return axios.put(`${BASE_URL_BATCH}/vault`, { vaultAddress, state });
}

export function getCreatorById(id: string) {
    return apiService.get<CreatorType>(`/creators/${id}`);
}
export function updateLicense(id: string, data: UpdateLicenseOptions) {
    return apiService.patch<CreatorType>(`/creators/${id}/licenses`, data);
}
export function getCreatorsPaginated(params: GetCreatorsPaginatedParams) {
    return axios.get<APIResponse<GetCreatorsPaginatedResponse>>(`${BASE_URL_API}/creators`, {
        headers: {
            Authorization: `Bearer ${store.getState().auth.token}`,
        },
        params,
    });
}
