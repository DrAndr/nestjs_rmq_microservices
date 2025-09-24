import { IsString } from 'class-validator';
import { CoursePaymentStatus } from '@e-shop/interfaces';


/**
 * Contracts
 */
export namespace PaymentCheck {
  export const topic = 'payment.check.query';

  export class Request {
    @IsString()
    userId!: string;

    @IsString()
    courseId!: string;

  }

  export class Response {
    @IsString()
    status!: CoursePaymentStatus;
  }
}
