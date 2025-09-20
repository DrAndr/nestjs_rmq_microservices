import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Post()
  create(@Body() user: UserEntity) {
    return this.userRepository.createUser(user);
  }

  @Get()
  findAll() {
    return this.userRepository.getUsers();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userRepository.findUserByEmail(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() user: UserEntity) {
    return this.userRepository.updateUser(email, user );
  }

  @Delete(':email')
  delete(@Param('email') email: string) {
    return this.userRepository.deleteUser(email);
  }
}
