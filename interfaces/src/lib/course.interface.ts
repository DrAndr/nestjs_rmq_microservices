
export enum CoursePaymentStatus {
  cancelled="cancelled",
  success="success",
  progress="progress"
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  published: boolean;
  author: string;
  price: number;
}
