import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: 'env/.e-shop.env'}),
    RMQModule.forRootAsync(getRMQConfig()),
    MongooseModule.forRootAsync(getMongoConfig()),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
