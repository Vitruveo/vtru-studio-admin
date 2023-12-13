export interface EmailType {
  email: string;
  checkedAt: Date | null;
}

export interface CreatorType {
  _id: string;
  name: string;
  login: { email: string };
  roles: string[];
  emails: EmailType[];
}
