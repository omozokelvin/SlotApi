import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  @IsEmail({}, { message: ErrorMessages.PROVIDE_VALID_EMAIL })
  email: string;
}
