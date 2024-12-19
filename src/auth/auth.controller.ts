import { GetUser } from '@/_common/decorators/get-user.decorator';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';
import { LogoutInterceptor } from '@/_common/interceptors/logout.interceptor';
import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { GoogleLoginDto } from '@/auth/dtos/google-login.dto';
import { LoginDto } from '@/auth/dtos/login.dto';
import { RefreshTokenDto } from '@/auth/dtos/refresh-token.dto';
import { SetPasswordDto } from '@/auth/dtos/set-password.dto';
import { UpdatePasswordDto } from '@/auth/dtos/update-password.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { AuthService } from '@/auth/services/auth.service';
import { SendOtpDto } from '@/otp/dtos/send-otp.dto';
import { VerifyOtpDto } from '@/otp/dtos/verify-otp.dto';
import { OtpService } from '@/otp/otp.service';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/user/dtos/update-user.dto';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags(ApiTagsEnum.authentication)
@ApiBearerAuth()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  @Post('/register')
  async register(@Headers() headers: Headers, @Body() body: CreateUserDto) {
    const userAgent = headers['user-agent'];
    return this.userService.createUser(body, userAgent);
  }

  @Post('/google')
  googleLogin(@Headers() headers: Headers, @Body() body: GoogleLoginDto) {
    const userAgent = headers['user-agent'];

    return this.authService.authenticateWithGoogle(body, userAgent);
  }

  @Post('/otp/send')
  async sendOtp(@Headers() headers: Headers, @Body() body: SendOtpDto) {
    const userAgent = headers['user-agent'];

    return this.otpService.sendOtp(body, userAgent);
  }

  @Patch('/otp/verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.otpService.verifyOtp(body);
  }

  @Post('/set-password')
  async setPassword(@Headers() headers: Headers, @Body() body: SetPasswordDto) {
    const userAgent = headers['user-agent'];

    return this.authService.setPassword(body, userAgent);
  }

  @Patch('/change-password')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.userService.changePassword(body);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  async login(@Headers() headers: Headers, @GetUser() user: IUser) {
    const userAgent = headers['user-agent'];

    return this.authService.login(user, userAgent);
  }

  @Post('/refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(LogoutInterceptor)
  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: IUser, @Headers() headers: Headers): IUser {
    // TODO: how will this work on mobile
    const userAgent = headers['user-agent'];
    this.logger.log({ userAgent });
    return user;
  }

  @Patch('/me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Body() body: UpdateUserDto, @GetUser() user: IUser) {
    return this.userService.updateProfile(body, user);
  }

  @Delete('/me')
  @UseGuards(JwtAuthGuard)
  deleteProfile(@GetUser() user: IUser) {
    return this.userService.deleteProfile(user);
  }

  @Patch('/update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(@Body() body: UpdatePasswordDto, @GetUser() user: IUser) {
    return this.authService.updatePassword(body, user);
  }
}
