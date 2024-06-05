export interface UserType {
    _id: string;
    name: string;
    login: { email: string };
    roles: string[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
