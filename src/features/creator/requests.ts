import axios from 'axios';
import { UpdateVaultStateOptions } from './types';
import { BASE_URL_BATCH } from '@/constants/api';

export async function updateVaultState({ vaultAddress, state }: UpdateVaultStateOptions) {
    return axios.put(`${BASE_URL_BATCH}/vault`, { vaultAddress, state });
}
