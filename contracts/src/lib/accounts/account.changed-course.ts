import { IsString } from 'class-validator';
import { PurchaseState } from '@e-shop/interfaces';

export namespace AccountChangedCourse {
  export const topic = "accounts.changed-course.event";

  export class Request  {
    @IsString()
    userId!: string;

    @IsString()
    courseId!: string;

    @IsString()
    state!: PurchaseState; // OR CoursePaymentStatus
  }
}
