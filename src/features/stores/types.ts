export interface Stores {
    _id: string;
    organization: Organization;
    artworks: Artworks;
    framework: Framework;
    status: StoreStatus;
    appearanceContent?: AppearanceContent;
    username: string;
    emails: {
        email: string;
        codeHash: string | null;
        checkedAt: string | null;
    }[];
    moderation?: {
        owner: string;
        createdAt: string;
    };
    hash?: string;
    actions: Actions;
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

export type StoreStatus = 'draft' | 'pending' | 'active' | 'inactive' | 'hidden';

export interface AppearanceContent {
    hideElements: {
        header: boolean;
        filters: boolean;
        artworkSpotlight: boolean;
        artistSpotlight: boolean;
        recentlySold: boolean;
        order: boolean;
        pageNavigation: boolean;
        assets: boolean;
        cardDetails: boolean;
    };
    highlightColor: string;
}

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

interface Actions {
    countClone: number;
    spotlight?: boolean;
    displaySpotlight?: boolean;
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

export interface UpdateStoresSpotlightParams {
    id: string;
    spotlight: boolean;
}
