import { TestingModule, Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../configs/mongo.config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from './auth.module';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { AccountLogin, AccountRegister } from '@e-shop/contracts';

const authLogin: AccountLogin.Request = {
  email: 'test@test.te',
  password: 'test',
};
const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'Test-user-name',
};

const loginError = 'Invalid login or password';

describe('AuthController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `../../env/.e-shop.env`,
        }),
        RMQModule.forTest({}), //forRootAsync(getRMQConfig()),
        UsersModule,
        AuthModule,
        MongooseModule.forRootAsync(getMongoConfig()),
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);

    await rmqService.init();
  });

  it('Register - Error wrong credentials', async () => {
    try {
      const resp = await rmqService.triggerRoute<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, { email: null, password: null });
      expect(resp).not.toBeDefined()
    } catch (e) {
      expect(e.message).toBeDefined();
    }

  });

  it('Register - success', async () => {
    try {
      const resp = await rmqService.triggerRoute<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, authRegister);

      expect(Object.keys(resp)).toEqual([
        '_id',
        'email',
        'displayName',
        'role',
      ]);
      expect(resp.email).toEqual(authRegister.email);
      expect(resp.displayName).toEqual(authRegister.displayName);
    } catch (e) {
      expect(e).not.toBeDefined()
    }
  });

  it('Register - Error user already exist', async () => {
    try {
      const resp = await rmqService.triggerRoute<
        AccountRegister.Request,
        AccountRegister.Response
      >(AccountRegister.topic, authRegister);

      expect(resp).not.toBeDefined();
    } catch (e) {
      expect(e.response).toEqual({
        message: 'Email already used',
        error: 'Unauthorized',
        statusCode: 401,
      });
    }
  });

  it('Login - Error wrong password', async () => {
    try{
      const resp = await rmqService.triggerRoute<
        AccountLogin.Request,
        AccountLogin.Response
      >(AccountLogin.topic, {
        email: 'test@test.te',
        password: 'WRONG',
      });

      expect(resp).not.toBeDefined()
    }catch (e) {
      expect(e.message).toEqual(loginError)
    }
  });

  it('Login - Error user not found', async () => {
    try{
      const resp = await rmqService.triggerRoute<
        AccountLogin.Request,
        AccountLogin.Response
      >(AccountLogin.topic, {
        email: 'wrong@wrong.ww',
        password: 'test',
      });

      expect(resp).not.toBeDefined()
    }catch (e) {
      expect(e.message).toEqual(loginError)
    }
  });

  it('Login - Success', async () => {
    const resp = await rmqService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);

    expect(Object.keys(resp)).toEqual(['access_token']);
    expect(resp.access_token).toBeDefined();
    expect(typeof resp.access_token).toBe('string');
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    await app.close();
  });
});
