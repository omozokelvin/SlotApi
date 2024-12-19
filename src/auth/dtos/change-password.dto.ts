import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { PASSWORD_REGEX } from '@/_common/constants/regex.constant';
import { FieldsMatch } from '@/_common/validations/fields-match.validation';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { PickType } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ChangePasswordDto extends PickType(CreateUserDto, [
  'email',
] as const) {
  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: ErrorMessages.INVALID_PASSWORD,
  })
  password: string;

  @IsString()
  @Matches(PASSWORD_REGEX, {
    message: ErrorMessages.INVALID_PASSWORD,
  })
  @FieldsMatch('password', { message: 'Confirm password must match password' })
  confirmPassword: string;
}
