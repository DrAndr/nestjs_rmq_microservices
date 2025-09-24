import { IsString } from 'class-validator';

/**
 * Contracts
 */
export namespace AccountBuyCourse {
  export const topic = 'account.buy-course.command';

  export class Request {
    @IsString()
    userId!: string;

    @IsString()
    courseId!: string;
  }

  export class Response {
    @IsString()
    paymentLink!: string;
  }
}
