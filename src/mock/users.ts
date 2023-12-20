export interface UserType {
  _id: string;
  name: string;
  profile: {
    avatar: string;
    phone: string;
    language: string;
    location: string;
  };
  login: { email: string };
  roles: string[];
  framework: {
    createdAt: Date | null;
    updatedAt: Date | null;
    createdBy: string | null;
    updatedBy: string | null;
  };
}
