import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { PASSWORD_REGEX } from '@/_common/constants/regex.constant';
import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { PickType } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UpdatePasswordDto extends PickType(ChangePasswordDto, [
  'password',
  'confirmPassword',
] as const) {
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: ErrorMessages.INVALID_PASSWORD,
  })
  oldPassword: string;
}
