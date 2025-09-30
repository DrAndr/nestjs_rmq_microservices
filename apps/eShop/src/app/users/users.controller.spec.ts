import { INestApplication } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { getMongoConfig } from '../configs/mongo.config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountBuyCourse,
  AccountChangeProfile, AccountCheckPayment,
  AccountLogin,
  AccountRegister,
  AccountUserInfo,
  CourseGetCourse,
  PaymentCheck,
  PaymentGenerateLink
} from '@e-shop/contracts';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CoursePaymentStatus, UserRole } from '@interfaces';

const authLogin: AccountLogin.Request = {
  email: 'test@test.te',
  password: 'test',
};
const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: 'Test-user-name',
};

const courseId: string = 'courseId';

describe('UsersController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let userId: string;
  let JWTUserId: string;
  let accessToken: string;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '../../env/.e-shop.env',
        }),
        RMQModule.forTest({}),
        UsersModule,
        AuthModule,
        MongooseModule.forRootAsync(getMongoConfig()),
      ],
    }).compile();

    app = module.createNestApplication();

    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    configService = app.get<ConfigService>(ConfigService);

    await app.init();
    await rmqService.init();

    // register the test user
    const { _id } = await rmqService.triggerRoute<
      AccountRegister.Request,
      AccountRegister.Response
    >(AccountRegister.topic, authRegister);
    userId = _id;
    // login as the test user
    const { access_token } = await rmqService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);
    accessToken = access_token;
    // process.env('JWT_SECRET')
    const userData = verify(
      accessToken,
      configService.get('JWT_SECRET') as string
    ) as JwtPayload;
    JWTUserId = userData['_id']; // just for test and comparing with userId ;
  });

  it('Compare user id from the user create response and fron JWT', () => {
    expect(userId).toBeDefined();
    expect(userId.toString()).toEqual(JWTUserId);
  });

  it('AccountUserInfo', async () => {
    const resp = await rmqService.triggerRoute<
      AccountUserInfo.Request,
      AccountUserInfo.Response
    >(AccountUserInfo.topic, {
      id: JWTUserId,
    });

    expect(Object.keys(resp)).toEqual([
      '_id',
      'email',
      'displayName',
      'role',
      'courses',
      'events',
    ]);
    expect(resp._id).toEqual(userId);
    expect(resp.displayName).toEqual(authRegister.displayName);
    expect(resp.email).toEqual(authLogin.email);
    expect(resp.role).toEqual(UserRole.USER);
  });

  it('changeProfile command', async () => {
    const newUserName = 'newName';
    await rmqService.triggerRoute<
      AccountChangeProfile.Request,
      AccountChangeProfile.Response
    >(AccountChangeProfile.topic, {
      id: userId.toString(),
      displayName: newUserName as string,
    });

    const updatedUser = await rmqService.triggerRoute<
      AccountUserInfo.Request,
      AccountUserInfo.Response
    >(AccountUserInfo.topic, {
      id: userId.toString(),
    });

    expect(updatedUser.displayName).toEqual(newUserName);
    expect(updatedUser.displayName).not.toEqual(authRegister.displayName);
  });

  it('buyCourse command', async () => {
    const paymentLink = 'paymentLink';

    rmqService.mockReply<CourseGetCourse.Response>(CourseGetCourse.topic, {
      _id: courseId,
      title: '',
      description: '',
      published: true,
      author: '',
      price: 1000,
    });

    rmqService.mockReply<PaymentGenerateLink.Response>(
      PaymentGenerateLink.topic,
      { paymentLink }
    );

    const resp = await rmqService.triggerRoute<
      AccountBuyCourse.Request,
      AccountBuyCourse.Response
    >(AccountBuyCourse.topic, {
      userId,
      courseId,
    });
    expect(resp).toEqual({ paymentLink });

    await expect(
      rmqService.triggerRoute<
        AccountBuyCourse.Request,
        AccountBuyCourse.Response
      >(AccountBuyCourse.topic, {
        userId,
        courseId,
      })
    ).rejects.toThrow('Please wait payment already processed.');
  });

  it('checkPayment command', async () => {
    rmqService.mockReply<PaymentCheck.Response>(PaymentCheck.topic, {
      status: CoursePaymentStatus.success
    });

    const resp = await rmqService.triggerRoute<AccountCheckPayment.Request, AccountCheckPayment.Response>(AccountCheckPayment.topic, {
      userId,
      courseId
    })

    expect(resp.status).toEqual(CoursePaymentStatus.success);
  });


  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    await app.close();
  });
});
