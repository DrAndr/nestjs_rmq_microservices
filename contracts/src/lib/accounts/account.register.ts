import { UserRole } from '@e-shop/interfaces';
import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * Contracts
 */
export namespace AccountRegister {

  export const topic = 'account.register.command';

  export class Request{
    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly password!: string;

    @IsOptional()
    @IsString()
    readonly displayName?: string;

    @IsOptional()
    @IsString()
    readonly role?: UserRole;
  }

  export class Response{
    readonly _id!: string;
    readonly email!: string;
    readonly displayName!: string;
    readonly role!: UserRole;
  }

}

