import { OtpChannelEnum } from '@/otp/otp.enum';
import { isEmail, isMobilePhone } from 'class-validator';

export const resolveAuthType = (
  emailOrPhone: string,
): OtpChannelEnum | null => {
  if (isEmail(emailOrPhone)) {
    return OtpChannelEnum.EMAIL;
  }

  if (isMobilePhone(emailOrPhone)) {
    return OtpChannelEnum.SMS;
  }

  return null;
};
