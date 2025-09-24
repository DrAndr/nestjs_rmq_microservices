import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQService } from 'nestjs-rmq';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@e-shop/contracts';
import { UserEntity } from './entities/user.entity';
import { IUser, IUserPublicProfile } from '@interfaces';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { UsersEventImmiter } from './users.event-immiter';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly usersEventImmiter: UsersEventImmiter
  ) {}

  /**
   *
   * @param displayName
   * @param id
   */
  public async changeProfile(
    displayName: Pick<IUser, 'displayName'>,
    id: string
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
    return await this.updateUser(user);
  }

  /**
   *
   * @param userId
   * @param courseId
   */
  public async buyCourse(
    userId: string,
    courseId: string
  ): Promise<AccountBuyCourse.Response> {
    const foundUser: IUserPublicProfile = await this.userRepository.getUser(
      userId
    );
    const userEntity: UserEntity = await new UserEntity(foundUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    // update payment status in userEntity and generate payment link.
    const { user, paymentLink } = await saga.getState().pay();

    // save updated user data.
    await this.updateUser(user);

    return { paymentLink };
  }

  /**
   *
   * @param userId
   * @param courseId
   */
  public async checkPayment(
    userId: string,
    courseId: string
  ): Promise<AccountCheckPayment.Response> {
    const foundUser: IUserPublicProfile = await this.userRepository.getUser(
      userId
    );
    const userEntity: UserEntity = await new UserEntity(foundUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);

    const { user, status } = await saga.getState().checkPayment();

    await this.updateUser(user);

    return { status };
  }

  private async updateUser(user: UserEntity) {
    return Promise.all([
      this.usersEventImmiter.handle(user),
      this.userRepository.updateUser(user),
    ])
  }
}
