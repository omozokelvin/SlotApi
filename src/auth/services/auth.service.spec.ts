// src/auth/services/auth.service.spec.ts

import { AuthPayload, AuthSuccessResponse } from '@/auth/dtos/auth.dto';
import { GoogleLoginDto } from '@/auth/dtos/google-login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { UpdatePasswordDto } from '@/auth/dtos/update-password.dto';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { GoogleService } from '@/google/google.service';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import { BadRequestException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TokenPayload } from 'google-auth-library';

describe(AuthService.name, () => {
  let authService: AuthService;
  let userService: UserService;
  // let tokenService: TokenService;
  let googleService: GoogleService;

  const user: IUser = {
    id: 'user-id',
    firstName: '',
    lastName: '',
    email: '',
    referralCode: '',
    emailVerified: false,
    mobileVerified: false,
    passwordSet: true,
  };

  const expiresAt = new Date('2024-12-19T11:01:03.936Z');

  jest.spyOn(global, 'Date').mockImplementation(() => expiresAt);

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            setPassword: jest.fn(),
            createUserFromGoogleProfile: jest.fn().mockResolvedValue(user),
            updatePassword: jest.fn().mockResolvedValue(null),
            findByEmail: jest.fn(),
            createUser: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: TokenService,
          useValue: {
            decodeRefreshToken: jest
              .fn()
              .mockResolvedValue({ jwtid: 'jwt-id' }),
            generateAccessToken: jest.fn().mockResolvedValue({
              accessToken: 'access-token',
              expiresIn: '3600ms',
            }),
            createAccessTokenFromRefreshToken: jest.fn().mockResolvedValue({
              accessToken: 'access-token',
              expiresIn: '3600ms',
            }),
            generateRefreshToken: jest.fn().mockResolvedValue('refresh-token'),
          },
        },
        {
          provide: GoogleService,
          useValue: {
            verifyIdToken: jest.fn(),
            getUserProfile: jest.fn(),
          },
        },
        {
          provide: getConnectionToken(),
          useValue: {
            startSession: jest.fn().mockResolvedValue({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn(),
              endSession: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    // tokenService = module.get<TokenService>(TokenService);
    googleService = module.get<GoogleService>(GoogleService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return login response', async () => {
      const userAgent = 'test-agent';

      const loginResponse = {
        payload: {
          accessToken: 'access-token',
          expiresAt,
          expiresIn: '3600ms',
          refreshToken: 'refresh-token',
          type: 'bearer',
        },
        user,
      };

      const result = await authService.login(user, userAgent);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('authenticateWithGoogle', () => {
    it('should authenticate with Google and return login response', async () => {
      const body: GoogleLoginDto = { idToken: 'id-token' };
      const userAgent = 'test-agent';
      const profile: TokenPayload = {
        email: 'test@example.com',
        iss: '',
        sub: '',
        aud: '',
        iat: 0,
        exp: 0,
      };

      const loginResponse: AuthSuccessResponse = {
        payload: new AuthPayload(),
      };

      jest.spyOn(googleService, 'getUserProfile').mockResolvedValue(profile);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await authService.authenticateWithGoogle(body, userAgent);
      expect(result).toEqual(loginResponse);
    });

    it('should create new user from Google profile and return user', async () => {
      const body: GoogleLoginDto = { idToken: 'id-token' };
      const userAgent = 'test-agent';
      const profile: TokenPayload = {
        email: 'test@example.com',
        iss: '',
        sub: '',
        aud: '',
        iat: 0,
        exp: 0,
      };

      jest.spyOn(googleService, 'getUserProfile').mockResolvedValue(profile);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.authenticateWithGoogle(body, userAgent);
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException on error', async () => {
      const body: GoogleLoginDto = { idToken: 'id-token' };
      const userAgent = 'test-agent';

      jest
        .spyOn(googleService, 'getUserProfile')
        .mockRejectedValue(new Error('Error'));

      await expect(
        authService.authenticateWithGoogle(body, userAgent),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and return response payload', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'refresh-token',
      };

      jest.spyOn(global, 'Date').mockImplementation(() => expiresAt);

      const responsePayload = {
        payload: {
          accessToken: 'access-token',
          expiresAt,
          expiresIn: '3600ms',
          refreshToken: 'refresh-token',
          type: 'bearer',
        },
      };

      const result = await authService.refreshToken(refreshTokenDto);

      expect(result).toEqual(responsePayload);
    });
  });

  describe('updatePassword', () => {
    it('should update password and return success message', async () => {
      const body: UpdatePasswordDto = {
        oldPassword: 'old-password',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };
      const user = { id: '1' } as IUser;
      const successMessage = { message: 'Password changed' };

      jest.spyOn(userService, 'updatePassword').mockResolvedValue(undefined);

      const result = await authService.updatePassword(body, user);

      expect(userService.updatePassword).toHaveBeenCalledWith(body, user);
      expect(result).toEqual(successMessage);
    });
  });

  describe('logout', () => {
    it('should return true', async () => {
      const result = await authService.logout();
      expect(result).toBe(true);
    });
  });
});
