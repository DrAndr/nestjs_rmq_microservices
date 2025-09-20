import { UserRole } from '@e-shop/interfaces';

export class RegisterDto {
  readonly email!: string;
  readonly password!: string;
  readonly displayName?: string;
  readonly role?: UserRole.USER;
}
