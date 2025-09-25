import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: async (configService: ConfigService) => ({
      uri: await getMongoString(configService),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

const getMongoString = async (configService: ConfigService) => {

  /**
   * run the memory db for tests
   */
  if (process.env.NODE_ENV === 'test') {
    const mongod = await MongoMemoryServer.create();
    return  mongod.getUri();
  }

  return 'mongodb://' +
    configService.get<string>('MONGO_LOGIN') +
    ':' +
    configService.get<string | number>('MONGO_PASSWORD') +
    '@' +
    configService.get<string | number>('MONGO_HOST') +
    ':' +
    configService.get<string | number>('MONGO_PORT') +
    '/' +
    configService.get<string>('MONGO_DATABASE') +
    '?authSource=' +
    configService.get<string>('MONGO_AUTHDATABASE');
}
