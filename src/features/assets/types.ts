import { AssetType } from '@/app/home/types/apps/asset';

export interface UpdateAssetStatusByIdParams {
    id: string;
    status: 'active' | 'blocked';
}

export interface UpdateAssetStatusByCreatorIdParams {
    creatorId: string;
    status: string;
}

export interface GetAssetStatusByCreatorIdParams {
    creatorId: string;
}

export interface InitialState {
    byId: Record<string, AssetType>;
    allIds: string[];
    filter: 'all' | 'blocked';
}

export type ChangeFilterParams = 'all' | 'blocked';
