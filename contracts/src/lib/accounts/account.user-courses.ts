import { IsString } from 'class-validator';
import { IUserCourses, PurchaseState } from '@e-shop/interfaces';

/**
 * Contracts
 */
export namespace AccountUserCourses{

  export const topic = 'account.user-courses.query';

  export class Request{
    @IsString()
    id!:string;// userId
  }

  export class Response implements IUserCourses{
    // @IsString()
    // _id!: string; // User courses entity use no _id

    @IsString()
    courseId!: string;

    @IsString()
    purchaseState!: PurchaseState;
  }

}
