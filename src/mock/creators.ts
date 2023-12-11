export interface CreatorType {
  _id: string;
  name: string;
  login: { email: string };
  roles: string[];
}
