import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {

  @UseGuards(JWTAuthGuard)
  @Post('info')
  create(@UserId() userId: string) {
    return userId;
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
