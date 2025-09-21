import { Body, Controller } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUserCourses, AccountUserInfo } from '@e-shop/contracts';


@Controller()
export class UsersQueries {
  constructor(private readonly userRepository: UserRepository) {
  }

  /**
   * Return a public user info
   * @param id
   */
  @RMQValidate()
  @RMQRoute(AccountUserInfo.topic)
  async userInfo(@Body() {id}: AccountUserInfo.Request): Promise<Partial<AccountUserInfo.Response>> {

    console.log('info', id);
    return this.userRepository.getUser(id)
  }

  /**
   * Return list of the user courses
   * @param id
   */
  @RMQValidate()
  @RMQRoute(AccountUserCourses.topic)
  async userCourses(@Body() {id}: AccountUserCourses.Request): Promise<AccountUserCourses.Response[]> {
    return this.userRepository.getUserCourses(id)
  }
}
