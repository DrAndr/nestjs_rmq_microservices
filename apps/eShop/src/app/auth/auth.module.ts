import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../configs/jwt.config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync(getJwtConfig())
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
