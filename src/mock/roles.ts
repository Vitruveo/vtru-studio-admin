export interface RoleType {
    _id: string;
    name: string;
    description: string;
    permissions: string[];
    framework: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
