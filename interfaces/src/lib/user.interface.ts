export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export enum PurchaseStatus {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Cancelled = 'Cancelled',
}

export interface IUserCourses {
  _id: string;
  courseId: string;
  purchaseStatus: PurchaseStatus;
}

export interface IUserPublicProfile {
  _id?: string | unknown;
  displayName?: string;
  email: string;
  role: UserRole;
};

export interface IUser extends IUserPublicProfile{
  password: string;
  courses?: IUserCourses[];
}
