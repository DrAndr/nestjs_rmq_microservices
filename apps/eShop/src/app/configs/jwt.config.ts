import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


console.log('process.env.JWT_SECRET',process.env.JWT_SECRET)
export const getJwtConfig = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'SECRET',//process.env.JWT_SECRET || 'SECRET',
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN'),// process.env.JWT_EXPIRES_IN || '1d',
    }
  })
});
