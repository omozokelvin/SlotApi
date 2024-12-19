import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { SetPasswordDto } from '@/auth/dtos/set-password.dto';
import { UpdatePasswordDto } from '@/auth/dtos/update-password.dto';
import { AuthSuccessResponse } from '@/auth/dtos/auth.dto';
import { TokenService } from '@/auth/services/token.service';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { addHours, addMilliseconds } from 'date-fns';
import { GoogleLoginDto } from '@/auth/dtos/google-login.dto';
import { GoogleService } from '@/google/google.service';
import { ClientSession, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { TokenPayload } from 'google-auth-library';
import { SuccessMessages } from '@/_common/constants/success-messages.constant';
import { responder } from '@/_common/helpers/responder.helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly userService: UserService,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private readonly googleService: GoogleService,
  ) {}

  async setPassword(
    body: SetPasswordDto,
    userAgent: string,
  ): Promise<AuthSuccessResponse> {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      const user = await this.userService.setPassword(body, session);

      const loginResponse = await this.login(user, userAgent);

      await session.commitTransaction();

      return loginResponse;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException((error as Error)?.message);
    } finally {
      session.endSession();
    }
  }

  async login(
    user: IUser,
    userAgent: string,
    session: ClientSession = null,
  ): Promise<AuthSuccessResponse> {
    const refreshToken = await this.tokenService.generateRefreshToken(
      user.id,
      userAgent,
      session,
    );

    const { jwtid } = await this.tokenService.decodeRefreshToken(refreshToken);

    const { accessToken, expiresIn } =
      await this.tokenService.generateAccessToken(user, jwtid);

    return this.buildResponsePayload(
      accessToken,
      expiresIn,
      refreshToken,
      user,
    );
  }

  async authenticateWithGoogle(
    body: GoogleLoginDto,
    userAgent: string,
  ): Promise<AuthSuccessResponse | IUser> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const profile = await this.googleService.getUserProfile(body.idToken);

      const { email } = profile;

      const existingUser = await this.userService.findByEmail(email, session);

      let response: AuthSuccessResponse | IUser = null;

      if (existingUser) {
        this.logger.log('User already exists');
        existingUser.id = existingUser.id;

        response = await this.login(existingUser, userAgent, session);
      } else {
        response = await this.createUserFromGoogle(profile, userAgent, session);
      }

      await session.commitTransaction();

      return response;
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException((error as Error)?.message);
    } finally {
      await session.endSession();
    }
  }

  private async createUserFromGoogle(
    profile: TokenPayload,
    userAgent: string,
    session: ClientSession = null,
  ) {
    const {
      email,
      family_name: lastName,
      given_name: firstName,
      picture: photo,
      email_verified: emailVerified,
    } = profile;

    const user = await this.userService.createUser(
      {
        email,
        firstName,
        lastName,
        emailVerified,
        photo,
        acceptTerms: true,
      },
      userAgent,
      session,
    );

    return user;
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;

    const { accessToken, expiresIn } =
      await this.tokenService.createAccessTokenFromRefreshToken(refreshToken);

    return this.buildResponsePayload(accessToken, expiresIn, refreshToken);
  }

  async updatePassword(body: UpdatePasswordDto, user: IUser) {
    await this.userService.updatePassword(body, user);

    return responder.success(SuccessMessages.PASSWORD_CHANGED);
  }

  async logout() {
    // this.taskService.deleteInterval(CronIntervals.ping);
    return true;
  }

  private buildResponsePayload(
    accessToken: string,
    expiresIn: string, // ms
    refreshToken?: string,
    user?: IUser,
  ): AuthSuccessResponse {
    // expires in is in milliseconds,

    const expiresInNumber = +expiresIn.split('ms')[0];

    let expiresAt = addHours(new Date(), 1);

    expiresAt = addMilliseconds(expiresAt, expiresInNumber);

    return {
      ...(user && { user }),
      payload: {
        type: 'bearer',
        accessToken,
        expiresIn,
        ...(refreshToken && { refreshToken }),
        expiresAt,
      },
    };
  }
}
