import { appProps } from '@/_common/config/app-props.constant';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import { AuthController } from '@/auth/auth.controller';
import { RoleGuard } from '@/auth/guards/role.guard';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '@/auth/schemas/refresh-token.schema';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { AnonymousStrategy } from '@/auth/strategies/anonymous.strategy';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { GoogleModule } from '@/google/google.module';
import { OtpModule } from '@/otp/otp.module';
import { UserModule } from '@/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: RefreshToken.name,
        useFactory: async () => {
          const schema = RefreshTokenSchema;

          schema.index(
            { updatedAt: 1 },
            { expireAfterSeconds: appProps().refreshTokenTll },
          );

          return schema;
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        const secret = configService.get('ACCESS_TOKEN_SECRET', {
          infer: true,
        });

        return {
          secret,
          signOptions: {
            expiresIn: appProps().accessTokenTll,
          },
        };
      },
      inject: [ConfigService<EnvironmentVariables>],
    }),
    forwardRef(() => UserModule),
    GoogleModule,
    OtpModule,
  ],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    AnonymousStrategy,
    RoleGuard,
  ],
  controllers: [AuthController],
  exports: [TokenService, AuthService],
})
export class AuthModule {}
