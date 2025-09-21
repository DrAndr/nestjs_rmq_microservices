import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UserRepository } from './repositories/user.repository';
import { UsersCommands } from './users.commands';
import { UsersQueries } from './usersQueries';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ])
  ],
  controllers: [UsersCommands, UsersQueries], // UsersCommands instead of UsersController
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
