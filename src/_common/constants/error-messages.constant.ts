import { resolveAuthType } from '@/_common/helpers/auth.helper';
import { OtpChannelEnum } from '@/otp/otp.enum';
import { ApiRoute } from '@/role/schemas/api-route.schema';

export class ErrorMessages {
  static readonly PROVIDE_VALID_EMAIL = 'Please provide a valid email address';
  static readonly PROVIDE_VALID_MOBILE_NUMBER =
    'Please provide a valid mobile number';
  static readonly EXPIRED_OTP_CODE =
    'OTP code has expired, please request a new one';
  static readonly INVALID_OTP_CODE = 'Invalid OTP code';
  static readonly REQUEST_OTP_CODE = 'Please request for verification code';
  static readonly ALREADY_VERIFIED_OTP = 'OTP code has already been verified';
  static readonly OTP_NOT_SENT =
    'OTP code could not be sent, please try again later';
  static readonly INVALID_REFRESH_TOKEN = 'Refresh token is invalid';
  static readonly MALFORMED_REFRESH_TOKEN = 'Refresh token malformed';
  static readonly EXPIRED_REFRESH_TOKEN = 'Refresh token expired';
  static readonly SORT_ORDER_ERROR = 'Sort order should either be asc or desc';
  static readonly INVALID_ID = 'Invalid ID provided';
  static readonly EMPTY_PAYLOAD = 'Payload should not be empty';
  // static readonly PASSWORD_TOO_SHORT = 'Password is too short';
  static readonly USER_NOT_FOUND = 'User not found';
  static readonly INVALID_CREDENTIALS = 'Invalid credentials';
  static readonly INVALID_COLOR = 'Please provide RGB or HEX color';
  static readonly PASSWORDS_DO_NOT_MATCH =
    'Password and confirm password do not match';
  static readonly PASSWORDS_MATCH = 'Old password is same as new password';
  static readonly REFERRAL_NOT_FOUND = 'Referral not found';
  static readonly INVALID_PASSWORD =
    'Password must be minimum eight characters, at least one uppercase, one lowercase and one number';

  static otpCodeMismatch(emailOrPhoneNumber: string) {
    const type = resolveAuthType(emailOrPhoneNumber);

    if (type === OtpChannelEnum.EMAIL) {
      return 'Please provide the OTP code sent to your email';
    }

    return 'Please provide the OTP code sent to your mobile number';
  }

  static userAlreadyExist(emailOrPhoneNumber: string): string {
    const type = resolveAuthType(emailOrPhoneNumber);

    if (type === OtpChannelEnum.EMAIL) {
      return 'User with that email address already exists';
    }

    if (type === OtpChannelEnum.SMS) {
      return 'User with that mobile number already exists';
    }

    return 'User already exists';
  }

  static notFound(schema: string, id: string) {
    return `${schema} with id: ${id} not found`;
  }

  static sortField(fields = []) {
    if (fields.length) {
      return `Sort field should be one off ${fields.join(', ').trim()}`;
    }

    return `Invalid sort field passed`;
  }

  static alreadyExist(schema: string, key: string, value: string) {
    return `${schema} with ${key}: ${value} already exist`;
  }

  static routeDoesNotExist(apiRoute: ApiRoute) {
    return `Route ${apiRoute.method.toUpperCase()} ${
      apiRoute.path
    } does not exist`;
  }
}
