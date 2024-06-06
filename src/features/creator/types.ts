import { EmailType } from '@/mock/creators';

export interface CreatorType {
    _id: string;
    name: string;
    login: { email: string };
    roles: string[];
    emails: EmailType[];
}

export interface InitialState {
    byId: { [key: string]: CreatorType };
    allIds: string[];
    status: '' | 'loading' | 'succeeded' | 'failed';
    error: string;
}
