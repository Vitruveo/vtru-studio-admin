export interface Stores {
    _id: string;
    organization: Organization;
    artworks: Artworks;
    framework: Framework;
    status: StoreStatus;
    username: string;
    emails: {
        email: string;
        codeHash: string | null;
        checkedAt: string | null;
    }[];
}

interface Media {
    name: string;
    path: string;
}

export interface Formats {
    logo: {
        horizontal: Media;
        square: Media;
    };
    banner: Media;
}

export interface Artworks {
    general: {
        shortcuts?: {
            hideNudity?: boolean;
            hideAI?: boolean;
            photography?: boolean;
            animation?: boolean;
            physicalArt?: boolean;
            digitalArt?: boolean;
            includeSold?: boolean;
            hasBTS?: boolean;
        };
        licenses?: {
            minPrice?: number;
            maxPrice?: number;
            enabled?: boolean;
        };
    };
    context: {
        culture?: string[];
        mood?: [string, string][];
        orientation?: [string, string][];
        precision?: number;
        colors?: string[];
    };
    taxonomy: {
        objectType?: [string, string][];
        tags?: [string, string][];
        collections?: [string, string][];
        aiGeneration?: [string, string][];
        arEnabled?: [string, string][];
        nudity?: [string, string][];
        category?: [string, string][];
        medium?: [string, string][];
        style?: [string, string][];
        subject?: [string, string][];
    };
    artists: {
        name?: [string, string][];
        nationality?: [string, string][];
        residence?: [string, string][];
    };
}

export type StoreStatus = 'draft' | 'pending' | 'active' | 'inactive';

interface Framework {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}
interface Organization {
    url: string | null;
    name: string;
    description: string | null;
    markup: number;
    formats: Formats | null;
}

export interface GetStoresPaginatedParams {
    page: number;
    limit: number;
    status: string;
    search?: string;
}

export interface GetStoresPaginatedResponse {
    data: Stores[];
    page: number;
    total: number;
    totalPage: number;
}

export interface UpdateStoreStatusParams {
    id: string;
    status: StoreStatus;
}
