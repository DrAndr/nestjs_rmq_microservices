export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface IUser {
  _id?: string | unknown;
  displayName?: string;
  email: string;
  password: string;
  role: UserRole;
}
