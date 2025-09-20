import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export function getRMQConfig():IRMQServiceAsyncOptions{
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {

      console.log('configService.get(\'AMQP_LOGIN\')', configService.get('AMQP_LOGIN'))

      return {
      exchangeName: configService.get('AMQP_EXCHANGE') ?? 'eshop',
      connections: [
        {
          login: configService.get('AMQP_LOGIN') ?? 'guest',
          password: configService.get('AMQP_PASSWORD') ?? 'guest',
          host: configService.get('AMQP_HOST') ?? 'localhost',
        },
      ],
      // queueName: configService.get('AMQP_QUEUE') ?? '',
      prefetchCount: 32,
      serviceName: "e-shop"
    }},
  }
}
