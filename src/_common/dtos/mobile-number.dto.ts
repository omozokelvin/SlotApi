import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { getInternationalPhoneNumber } from '@/_common/helpers/mobile.helper';
import { Transform } from 'class-transformer';
import { IsMobilePhone, IsOptional } from 'class-validator';

export class MobileNumberDto {
  @IsOptional()
  @Transform(({ value }) => getInternationalPhoneNumber(value))
  @IsMobilePhone('en-NG', undefined, {
    message: ErrorMessages.PROVIDE_VALID_MOBILE_NUMBER,
  })
  mobileNumber?: string;
}
