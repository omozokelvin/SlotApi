import { appProps } from '@/_common/config/app-props.constant';
import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import {
  AuthSuccessResponse,
  RefreshTokenPayload,
  AccessTokenPayload,
} from '@/auth/dtos/auth.dto';
import { RefreshToken } from '@/auth/schemas/refresh-token.schema';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class TokenService {
  private readonly baseOptions: SignOptions = {
    issuer: appProps().baseUrl,
    audience: appProps().name,
  };

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly model: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public findById(id: string) {
    return this.model.findById(id);
  }

  async generateRefreshToken(
    userId: IUser['id'],
    userAgent: string,
    session: ClientSession = null,
  ) {
    const expires = this.generateExpires();

    //TODO: Check how this will work on mobile
    let token = await this.model.findOne(
      {
        user: userId,
        userAgent,
      },
      null,
      { session },
    );

    if (!token) {
      const tokens = await this.model.create(
        [
          {
            user: userId,
            userAgent,
            expiresAt: expires,
          },
        ],
        {
          session,
        },
      );

      token = tokens[0];
    } else {
      token.expiresAt = expires;
      token = await token.save({ session });
    }

    const payload = { subject: String(userId), jwtid: String(token.id) };

    const options: JwtSignOptions = {
      ...this.baseOptions,
      expiresIn: appProps().refreshTokenTll,
      secret: this.configService.get('REFRESH_TOKEN_SECRET', { infer: true }),
    };

    return this.jwtService.signAsync(payload, options);
  }

  async generateAccessToken(
    user: IUser,
    refreshTokenId: string,
  ): Promise<
    Pick<AuthSuccessResponse['payload'], 'accessToken' | 'expiresIn'>
  > {
    const payload = {
      subject: String(user.id),
      jwtid: refreshTokenId,
      roles: user.roles,
    };

    const opts: SignOptions = {
      ...this.baseOptions,
    };

    const accessToken = await this.jwtService.signAsync(payload, opts);

    const accessTokenTtl = appProps().accessTokenTll * 1000 + 'ms';

    // we return expiresIn in milliseconds
    return { accessToken, expiresIn: accessTokenTtl };
  }

  async resolveRefreshToken(encoded: string) {
    const payload = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException(
        ErrorMessages.INVALID_REFRESH_TOKEN,
      );
    }

    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException(
        ErrorMessages.MALFORMED_REFRESH_TOKEN,
      );
    }

    return { user, token };
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    const { user, token } = await this.resolveRefreshToken(refreshToken);

    token.expiresAt = this.generateExpires();

    await token.save();

    const { accessToken, expiresIn } = await this.generateAccessToken(
      user,
      token._id.toString(),
    );

    return { user, accessToken, expiresIn };
  }

  async decodeRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      const options: JwtVerifyOptions = {
        ...this.baseOptions,
        secret: this.configService.get('REFRESH_TOKEN_SECRET', {
          infer: true,
        }),
      };

      return await this.jwtService.verifyAsync(refreshToken, options);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException(
          ErrorMessages.EXPIRED_REFRESH_TOKEN,
        );
      } else {
        throw new UnprocessableEntityException(
          ErrorMessages.MALFORMED_REFRESH_TOKEN,
        );
      }
    }
  }

  async decodeAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      return null;
    }
  }

  public getStoredValidRefreshTokenById(refreshTokenId: string) {
    return this.model.findOne({
      _id: refreshTokenId,
      isRevoked: false,
      expiresAt: { $gte: new Date() },
    });
  }

  async deleteRefreshToken(refreshTokenId: string) {
    return this.model.findByIdAndDelete(refreshTokenId);
  }

  async deleteRefreshTokenByUserId(
    userId: string,
    session: ClientSession = null,
  ): Promise<any> {
    return this.model.deleteMany({ user: userId }, { session });
  }

  private async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload) {
    const subId = payload.subject;

    if (!subId) {
      throw new UnprocessableEntityException(
        ErrorMessages.MALFORMED_REFRESH_TOKEN,
      );
    }

    return this.userService.getById(subId);
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ) {
    const tokenId = payload.jwtid;

    if (!tokenId) {
      throw new UnprocessableEntityException(
        ErrorMessages.MALFORMED_REFRESH_TOKEN,
      );
    }

    return this.getStoredValidRefreshTokenById(tokenId);
  }

  private generateExpires() {
    const ttl = appProps().refreshTokenTll * 1000; // needs to be in milliseconds

    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    return expires;
  }
}
