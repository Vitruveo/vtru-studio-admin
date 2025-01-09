import { APIResponse } from '../common/types';

export interface FeatureItem {
    _id: string;
    name: string;
    released: boolean;
    onlyForAllowList: boolean;
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export interface AddFeatureItem {
    name: string;
}

export type FindFeaturesApiRes = APIResponse<FeatureItem[]>;
