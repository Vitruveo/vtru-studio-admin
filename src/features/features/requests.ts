import { apiService } from '@/services/api';
import { AddFeatureItem, FindFeaturesApiRes, FeatureItem } from './types';

export async function findFeatures(): Promise<FindFeaturesApiRes> {
    const response = await apiService.get<FeatureItem[]>('/features');

    return response;
}

export async function addFeature(data: AddFeatureItem): Promise<any> {
    const response = await apiService.post('/features', data);

    return response;
}

export async function updateFeature(data: FeatureItem): Promise<any> {
    const response = await apiService.put(`/features/${data._id}`, data);

    return response;
}

export async function deleteFeature(id: string): Promise<any> {
    const response = await apiService.delete(`/features/${id}`);

    return response;
}
