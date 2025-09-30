import { Controller, Get } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { AccountUserCourses, AccountUserInfo } from '@e-shop/contracts';

@Controller()
export class UsersQueries {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService
  ) {}

  /**
   * Return a public user info
   * @param id
   */
  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo({
    id,
  }: AccountUserInfo.Request): Promise<Partial<AccountUserInfo.Response>> {
    return this.userRepository.getUser(id);
  }

  /**
   * Return list of the user courses
   * @param id
   */
  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses({
    id,
  }: AccountUserCourses.Request): Promise<AccountUserCourses.Response[]> {
    return this.userRepository.getUserCourses(id);
  }

  @Get('helthcheck')
  async helthcheck() {
    const isRMQ = this.rmqService.healthCheck();
    const user = this.userRepository.helthcheck();
    return JSON.stringify({ rmq: isRMQ, db: !!user });
  }
}
