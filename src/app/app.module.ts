import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { LoggerModule } from 'nestjs-pino';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ServiceErrorInterceptor } from 'src/common/interceptors/service-error.interceptor';
// import { MailModule } from 'src/mail/mail.module';
// import { MediaModule } from 'src/media/media.module';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bullmq';
import Queues from 'src/common/constants/queues.constants';
import { QueueConnection } from 'src/common/processors/worker-host.processor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME'),
        },
      }),
      inject: [ConfigService],
    }),
    QueueConnection(Queues.SendMail),
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: true,
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),

    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useClass: ServiceErrorInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
