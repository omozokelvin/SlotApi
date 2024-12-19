import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { SendOtpDto } from './send-otp.dto';
import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { OTP_REGEX } from '@/_common/constants/regex.constant';

export class VerifyOtpDto extends SendOtpDto {
  @ApiProperty({
    example: '123456',
  })
  @Matches(OTP_REGEX, '', {
    message: ErrorMessages.INVALID_OTP_CODE,
  })
  code: string;
}
