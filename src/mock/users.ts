export interface UserType {
    _id: string;
    name: string;
    emails: {
        email: string;
        checkedAt: Date | null;
    }[];
    profile: {
        avatar: string;
        phone: string;
        language: string;
        location: string;
    };
    login: { email: string };
    roles: string[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
