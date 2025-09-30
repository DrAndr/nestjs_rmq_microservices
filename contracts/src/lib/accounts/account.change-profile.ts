import { IsString } from 'class-validator';
import { IUser } from '@e-shop/interfaces';
import { UpdateResult } from 'mongoose';

/**
 * Contracts
 */
export namespace AccountChangeProfile{

  export const topic = 'account.change-profile.command';

  export class Request {
    @IsString()
    id!: string;

    @IsString()
    displayName!: IUser['displayName'];
  }

  export class Response implements Partial<UpdateResult> {}

}
