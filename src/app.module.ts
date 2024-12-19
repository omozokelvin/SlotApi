import { AllExceptionsFilter } from '@/_common/filters/all.exception.filter';
import { TransformResponseInterceptor } from '@/_common/interceptors/transform.interceptor';
import { ProxyMiddleware } from '@/_common/middleware/proxy.middleware';
import {
  EnvironmentVariables,
  validateEnv,
} from '@/_common/validations/environment.validation';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';
import { RoleModule } from '@/role/role.module';
import { SendChampModule } from '@/sms/sendchamp/sendchamp.module';
import { TermiiModule } from '@/sms/termii/termii.module';
import { UserModule } from '@/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        const uri = configService.get('DATABASE_URL', { infer: true });

        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    MailModule,
    AuthModule,
    UserModule,
    RoleModule,
    SendChampModule,
    TermiiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProxyMiddleware).forRoutes('*');
  }
}
