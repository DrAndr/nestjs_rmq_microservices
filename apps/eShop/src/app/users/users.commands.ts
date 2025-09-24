import { BadRequestException, Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@e-shop/contracts';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { IUserPublicProfile } from '@interfaces';
import { BuyCourseSaga } from './sagas/buy-course.saga';

@Controller()
export class UsersCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile(
    @Body() { id, displayName }: AccountChangeProfile.Request
  ): Promise<AccountChangeProfile.Response> {
    // Simply approach, as I tough...
    // return this.userRepository.updateUser(id, { displayName: displayName as string });

    // get user by ID
    const existedUser = await this.userRepository.getUser(id);

    if (!existedUser) {
      throw new BadRequestException('User not found');
    }

    // update UserEntity
    const user: UserEntity = await new UserEntity(existedUser).updateProfile(
      displayName as string
    );

    // update whole user
    return await this.userRepository.updateUser(user);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountBuyCourse.Request
  ): Promise<AccountBuyCourse.Response> {
    const foundUser: IUserPublicProfile = await this.userRepository.getUser(
      userId
    );
    const userEntity: UserEntity = await new UserEntity(foundUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    // update payment status in userEntity and generate payment link.
    const { user, paymentLink } = await saga.getState().pay();

    // save updated user data.
    await this.userRepository.updateUser(user);

    return { paymentLink };
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async CheckPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    const foundUser: IUserPublicProfile = await this.userRepository.getUser(
      userId
    );
    const userEntity: UserEntity = await new UserEntity(foundUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    const { user, status } = await saga.getState().checkPayment();

    // hmmm... do we really need to update user when just was checked status payment...
    await this.userRepository.updateUser(user);

    return { status };
  }
}
