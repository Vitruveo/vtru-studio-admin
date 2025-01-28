import { APIResponse } from '../common/types';

export interface FeatureItem {
    _id: string;
    name: string;
    released: boolean;
    isOnlyFor: boolean;
    onlyFor: 'allowList' | 'specificUsers';
    emails: string[];
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
