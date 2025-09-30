import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountBuyCourse,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@e-shop/contracts';
import { UsersService } from './users.service';

@Controller()
export class UsersCommands {
  constructor(
    // private readonly userRepository: UserRepository,
    // private readonly rmqService: RMQService,
    private readonly service: UsersService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeProfile({
    id,
    displayName,
  }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    return await this.service.changeProfile(displayName, id);
  }

  @RMQValidate()
  @RMQRoute(AccountBuyCourse.topic)
  async buyCourse({
    userId,
    courseId,
  }: AccountBuyCourse.Request): Promise<AccountBuyCourse.Response> {
    return this.service.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment({
    userId,
    courseId,
  }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return this.service.checkPayment(userId, courseId);
  }
}
