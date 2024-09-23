import { AssetType } from '@/app/home/types/apps/asset';

export interface UpdateAssetStatusByIdParams {
    id: string;
    status: 'active' | 'blocked';
}

export interface UpdateAssetsNudityParams {
    ids: string[];
    nudity: boolean;
}

export interface GetAssetsPaginatedParams {
    page: number;
    name?: string;
    limit?: number;
    query?: Record<string, unknown>;
    sort?: Record<string, unknown>;
}

export interface GetAssetsByCreatorIdResponse {
    data: AssetType[];
    limit: number;
    page: number;
    total: number;
    totalPage: number;
}
export interface UpdateManyAssetsStatusByIdsParams {
    ids: string[];
    status: 'active' | 'blocked';
}

export interface GetCreatorNameByAssetIdParams {
    id: string;
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
    creator: string;
    filter: ChangeFilterParams;
    currentPage: number;
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export type ChangeFilterParams = 'all' | 'blocked' | 'consigned' | 'active';
