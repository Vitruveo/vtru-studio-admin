import { EmailType } from '@/mock/creators';

export interface CreatorType {
    _id: string;
    name: string;
    login: { email: string };
    roles: string[];
    emails: EmailType[];
    username: string;
    vault: {
        vaultAddress: string;
        isBlocked: boolean;
        isTrusted: boolean;
    };
    licenses?: {
        artCards: number;
    };
}

export interface InitialState {
    byId: { [key: string]: CreatorType };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
    error: string;
}

export interface UpdateVaultStateOptions {
    vaultAddress: string;
    state: boolean;
}

export interface UpdateLicenseOptions {
    license: string;
    value: number;
}
