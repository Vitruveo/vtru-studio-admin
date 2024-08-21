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
}

export interface InitialState {
    byId: { [key: string]: CreatorType };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
    error: string;
    loadingTrusted: boolean;
}

export interface UpdateVaultStateOptions {
    vaultAddress: string;
    state: boolean;
}

export interface updateVaultStateTrustedOptions {
    vaultAddress: string;
    state: boolean;
}
