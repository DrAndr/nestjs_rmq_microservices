import {
  Controller,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { AccountUserCourses, AccountUserInfo } from '@e-shop/contracts';

@Controller('user')
export class UserController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Get('info')
  async getUserPublicInfo(@UserId() userId: string) {
    try {
      return await this.rmqService.send<
        AccountUserInfo.Request,
        AccountUserInfo.Response
      >(AccountUserInfo.topic, { id: userId });
    } catch (e) {
      throw new UnauthorizedException(
        e instanceof Error ? e.message : 'Unauthorized'
      );
    }
  }

  @UseGuards(JWTAuthGuard)
  @Get('courses')
  async getUserCourses(@UserId() userId: string) {
    try {
      return await this.rmqService.send<
        AccountUserCourses.Request,
        AccountUserCourses.Response
      >(AccountUserCourses.topic, { id: userId });
    } catch (e) {
      throw new UnauthorizedException(
        e instanceof Error ? e.message : 'Unauthorized'
      );
    }
  }

  // @UseGuards(JWTAuthGuard)
  // @Post()
  // create(@Body() user) {
  //   // return this.userRepository.createUser(user);
  // }
  //
  // @Get()
  // findAll() {
  //   // return this.userRepository.getUsers();
  // }
  //
  // @UseGuards(JWTAuthGuard)
  // @Get(':email')
  // findOne(@Param('email') email: string) {
  //   // return this.userRepository.findUserByEmail(email);
  // }
  //
  // @UseGuards(JWTAuthGuard)
  // @Patch(':email')
  // update(@Param('email') email: string, @Body() user: UserEntity) {
  //   // return this.userRepository.updateUser(email, user );
  // }
  //
  // @UseGuards(JWTAuthGuard)
  // @Delete(':email')
  // delete(@Param('email') email: string) {
  //   // return this.userRepository.deleteUser(email);
  // }
}
