import { appProps } from '@/_common/config/app-props.constant';
import { LogoutInterceptor } from '@/_common/interceptors/logout.interceptor';
import { AuthController } from '@/auth/auth.controller';
import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { GoogleLoginDto } from '@/auth/dtos/google-login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { SetPasswordDto } from '@/auth/dtos/set-password.dto';
import { UpdatePasswordDto } from '@/auth/dtos/update-password.dto';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { SendOtpDto } from '@/otp/dtos/send-otp.dto';
import { VerifyOtpDto } from '@/otp/dtos/verify-otp.dto';
import { OtpChannelEnum, OtpTypeEnum } from '@/otp/otp.enum';
import { OtpService } from '@/otp/otp.service';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/user/dtos/update-user.dto';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Headers } from '@nestjs/common';

describe(AuthController.name, () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let otpService: OtpService;

  const headers = {
    'user-agent': 'test-agent',
  } as unknown as Headers;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            authenticateWithGoogle: jest.fn(),
            setPassword: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            changePassword: jest.fn(),
            updateProfile: jest.fn(),
            deleteProfile: jest.fn(),
          },
        },
        {
          provide: OtpService,
          useValue: {
            sendOtp: jest.fn(),
            verifyOtp: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            decodeAccessToken: jest.fn(),
          },
        },
        LogoutInterceptor,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    otpService = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call userService.createUser with correct parameters', async () => {
      const body: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        acceptTerms: false,
      };
      await authController.register(headers, body);
      expect(userService.createUser).toHaveBeenCalledWith(body, 'test-agent');
    });
  });

  describe('googleLogin', () => {
    it('should call authService.authenticateWithGoogle with correct parameters', async () => {
      const body: GoogleLoginDto = { idToken: 'test-token' };
      await authController.googleLogin(headers, body);
      expect(authService.authenticateWithGoogle).toHaveBeenCalledWith(
        body,
        'test-agent',
      );
    });
  });

  describe('sendOtp', () => {
    it('should call otpService.sendOtp with correct parameters', async () => {
      const body: SendOtpDto = {
        type: OtpTypeEnum.REGISTRATION,
        channel: OtpChannelEnum.EMAIL,
        value: appProps().adminEmail,
      };
      await authController.sendOtp(headers, body);
      expect(otpService.sendOtp).toHaveBeenCalledWith(body, 'test-agent');
    });
  });

  describe('verifyOtp', () => {
    it('should call otpService.verifyOtp with correct parameters', async () => {
      const body: VerifyOtpDto = {
        code: '123456',
        type: OtpTypeEnum.REGISTRATION,
        channel: OtpChannelEnum.EMAIL,
        value: appProps().adminEmail,
      };
      await authController.verifyOtp(body);
      expect(otpService.verifyOtp).toHaveBeenCalledWith(body);
    });
  });

  describe('setPassword', () => {
    it('should call authService.setPassword with correct parameters', async () => {
      const body: SetPasswordDto = {
        password: 'new-password',
        confirmPassword: '',
        email: '',
      };
      await authController.setPassword(headers, body);
      expect(authService.setPassword).toHaveBeenCalledWith(body, 'test-agent');
    });
  });

  describe('changePassword', () => {
    it('should call userService.changePassword with correct parameters', async () => {
      const body: ChangePasswordDto = {
        password: 'password',
        confirmPassword: 'password',
        email: appProps().adminEmail,
      };
      await authController.changePassword(body);
      expect(userService.changePassword).toHaveBeenCalledWith(body);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const user: IUser = { id: '1', email: 'test@example.com' } as IUser;
      await authController.login(headers, user);
      expect(authService.login).toHaveBeenCalledWith(user, 'test-agent');
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken with correct parameters', async () => {
      const body: RefreshTokenDto = { refreshToken: 'test-refresh-token' };
      await authController.refreshToken(body);
      expect(authService.refreshToken).toHaveBeenCalledWith(body);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      await authController.logout();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const user: IUser = { id: '1', email: 'test@example.com' } as IUser;
      const result = authController.getProfile(user, headers);
      expect(result).toBe(user);
    });
  });

  describe('updateProfile', () => {
    it('should call userService.updateProfile with correct parameters', async () => {
      const body: UpdateUserDto = { email: 'new@example.com' };
      const user: IUser = { id: '1', email: 'test@example.com' } as IUser;
      await authController.updateProfile(body, user);
      expect(userService.updateProfile).toHaveBeenCalledWith(body, user);
    });
  });

  describe('deleteProfile', () => {
    it('should call userService.deleteProfile with correct parameters', async () => {
      const user: IUser = { id: '1', email: 'test@example.com' } as IUser;
      await authController.deleteProfile(user);
      expect(userService.deleteProfile).toHaveBeenCalledWith(user);
    });
  });

  describe('updatePassword', () => {
    it('should call authService.updatePassword with correct parameters', async () => {
      const body: UpdatePasswordDto = {
        oldPassword: 'old-password',
        password: 'password',
        confirmPassword: 'password',
      };
      const user: IUser = { id: '1', email: 'test@example.com' } as IUser;
      await authController.updatePassword(body, user);
      expect(authService.updatePassword).toHaveBeenCalledWith(body, user);
    });
  });
});
