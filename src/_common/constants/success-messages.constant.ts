import {
  maskEmailAddress,
  maskPhoneNumber,
} from '@/_common/helpers/string.helper';
import { OtpChannelEnum } from '@/otp/otp.enum';

export class SuccessMessages {
  public static otpSent(
    emailOrPhoneNumber: string,
    type: OtpChannelEnum,
  ): string {
    return type === OtpChannelEnum.EMAIL
      ? `We have sent a verification code to ${maskEmailAddress(
          emailOrPhoneNumber,
        )}`
      : `We have sent a verification code to ${maskPhoneNumber(
          emailOrPhoneNumber,
        )}`;
  }

  public static otpVerified(emailOrPhoneNumber: string, type: OtpChannelEnum) {
    return type === OtpChannelEnum.EMAIL
      ? `We have verified ${maskEmailAddress(emailOrPhoneNumber)}`
      : `We have verified ${maskPhoneNumber(emailOrPhoneNumber)}`;
  }

  public static readonly PASSWORD_CHANGED = 'Password changed';
  public static readonly SUBSCRIBED = 'Thanks for subscribing!';
}
