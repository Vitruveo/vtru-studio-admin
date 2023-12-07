export interface UserType {
  _id: string;
  name: string;
  login: { email: string };
  roles: string[];
}
