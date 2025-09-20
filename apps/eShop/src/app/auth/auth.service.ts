import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { LoginDto } from './dto/login.dto';
// import { LoginResponse } from '@e-shop/interfaces';
import { UserRepository } from '../users/repositories/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import pick from 'lodash/pick';
import { JwtService } from '@nestjs/jwt';
import { AccountLogin, AccountRegister } from '@e-shop/contracts';
import { UserRole } from '@e-shop/interfaces';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtServices: JwtService
  ) {}

  async register({
    email,
    password,
    displayName = '',
    role,
  }: AccountRegister.Request): Promise<AccountRegister.Response> {
    const userExist = await this.userRepository.findUserByEmail(email);

    if (userExist !== null) {
      throw new UnauthorizedException('Email already used');
    }

    const userEntity = await new UserEntity({
      email,
      displayName,
      role,
    }).setPassword(password);
    const newUser = await this.userRepository.createUser(userEntity);

    return {
      _id: newUser._id as string,
      email: newUser.email,
      displayName: newUser.displayName as string,
      role: newUser?.role || UserRole.USER,
    };
  }

  async login(dto: AccountLogin.Request): Promise<AccountLogin.Response> {
    const user = await this.userRepository.findUserByEmail(dto.email);

    if (user) {
      const userEntity = new UserEntity(user);
      const isCorrectPwd: boolean = await userEntity.validatePassword(
        dto.password
      );

      if (isCorrectPwd) {
        return {
          access_token: this.jwtServices.sign(
            pick(userEntity, ['email', 'displayName', '_id'])
          ),
        };
      }
    }

    throw new UnauthorizedException('Invalid login or password');
  }

  logout() {
    return `User logged out`;
  }
}
