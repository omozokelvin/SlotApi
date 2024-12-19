import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/user/user.service';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import { AccessTokenPayload } from '@/auth/dtos/auth.dto';
import { TokenService } from '@/auth/services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService<EnvironmentVariables>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET', {
        infer: true,
      }),
    });
  }

  async validate(payload: AccessTokenPayload) {
    const { subject: userId, jwtid: refreshTokenId } = payload;

    const validRefreshToken =
      await this.tokenService.getStoredValidRefreshTokenById(refreshTokenId);

    if (!validRefreshToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getById(userId);

    return user;
  }
}
