import { BadRequestException, Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@e-shop/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UsersCommands {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile(
    @Body() { id, displayName }: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    // Simply approach, as I tough...
    // return this.userRepository.updateUser(id, { displayName: displayName as string });

    // get user by ID
    const existedUser = await this.userRepository.getUser(id);

    if(!existedUser){
      throw new BadRequestException('User not found');
    }

    // update UserEntity
    const user: UserEntity = await new UserEntity(existedUser).updateProfile(displayName as string);

    // update whole user
    return await this.userRepository.updateUser(user);
  }

}
