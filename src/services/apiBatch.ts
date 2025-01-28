import { BASE_URL_BATCH } from '@/constants/api';
import { APIResponse } from '@/features/common/types';
import { store } from '@/store/index';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: BASE_URL_BATCH,
    // timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const apiBatchService = {
    get: async <T = unknown, E = any>(url: string): Promise<APIResponse<T, E>> => {
        try {
            const response: AxiosResponse = await api.get(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    post: async <T = unknown, E = any>(url: string, data: any): Promise<APIResponse<T, E>> => {
        try {
            const response: AxiosResponse = await api.post(url, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    put: async <T = unknown, E = any>(url: string, data: any): Promise<APIResponse<T, E>> => {
        try {
            const response: AxiosResponse = await api.put(url, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    patch: async <T = unknown, E = any>(url: string, data: any): Promise<APIResponse<T, E>> => {
        try {
            const response: AxiosResponse = await api.patch(url, data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    delete: async <T = unknown, E = any>(url: string): Promise<APIResponse<T, E>> => {
        try {
            const response: AxiosResponse = await api.delete(url);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
