import {  IsNumber, IsString } from 'class-validator';

/**
 * Contracts
 */
export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsString()
    userId!: string;

    @IsString()
    courseId!: string;

    @IsNumber()
    sum!: number;
  }

  export class Response {
    paymentLink!: string;
  }
}
