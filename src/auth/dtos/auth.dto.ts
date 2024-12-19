import { IRefreshToken } from '@/auth/schemas/refresh-token.schema';
import { IRole } from '@/role/schemas/role.schema';
import { IUser } from '@/user/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPayload {
  refreshToken?: string;

  @ApiProperty({
    example: 'bearer',
  })
  type: string;

  accessToken: string;

  @ApiProperty({
    example: '10000ms',
  })
  expiresIn: string;

  @ApiProperty({
    example: new Date(),
  })
  expiresAt: string | Date;
}

export class AuthSuccessResponse {
  user?: IUser;
  payload: AuthPayload;
}

export class RefreshTokenPayload {
  subject: IUser['id'];
  jwtid: IRefreshToken['id'];
}

export class AccessTokenPayload extends RefreshTokenPayload {
  roles: Array<IRole['id']>;
}
