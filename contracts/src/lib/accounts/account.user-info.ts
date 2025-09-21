import { IsArray, IsString } from 'class-validator';
import { IUser, IUserCourses, UserRole } from '@e-shop/interfaces';

/**
 * Contracts
 */
export namespace AccountUserInfo{

  export const topic = 'account.user-info.query';

  export class Request{
    @IsString()
    id!:string;
  }

  export class Response implements Partial<IUser> {
    @IsString()
    _id!: string | unknown;

    @IsString()
    email!: string;

    @IsString()
    displayName!: string;

    @IsString()
    role!: UserRole;

    @IsArray()
    courses?: IUserCourses[];
  }

}
