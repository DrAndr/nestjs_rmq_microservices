import { IsString, IsBoolean, IsNumber } from 'class-validator';
import { ICourse } from '@e-shop/interfaces';

/**
 * Contracts
 */
export namespace CourseGetCourse{

  export const topic = 'course.get-course.query';

  export class Request{
    @IsString()
    id!:string;
  }

  export class Response implements Partial<ICourse> {

    @IsString()
    _id!: string;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsBoolean()
    published!: boolean;

    @IsString()
    author!: string;

    @IsNumber()
    price!: number;
  }

}
