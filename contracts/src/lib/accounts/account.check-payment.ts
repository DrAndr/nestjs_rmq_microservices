import { IsString } from 'class-validator';
import { CoursePaymentStatus } from '@e-shop/interfaces';

/**
 * Contracts
 */
export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.query';

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
