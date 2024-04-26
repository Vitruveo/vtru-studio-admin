import { EmailType } from '@/mock/creators';

export interface InitialState {
    all: CreatorType[];
}

export interface CreatorType {
    _id: string;
    name: string;
    login: { email: string };
    roles: string[];
    emails: EmailType[];
}
