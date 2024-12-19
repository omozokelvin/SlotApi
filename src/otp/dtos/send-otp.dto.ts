import { getInternationalPhoneNumber } from '@/_common/helpers/mobile.helper';
import { OtpChannelEnum, OtpTypeEnum } from '@/otp/otp.enum';
import { Transform } from 'class-transformer';
import {
  isEmail,
  IsEnum,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isMobilePhone,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsChannelValueConstraint implements ValidatorConstraintInterface {
  private errorMessage = '';

  validate(value: any, args: ValidationArguments) {
    try {
      const object = args.object as any;

      switch (object.channel) {
        case OtpChannelEnum.EMAIL:
          if (!isEmail(value)) {
            throw new Error('Provide a valid email address');
          }
          break;

        case OtpChannelEnum.SMS:
          if (!isMobilePhone(value, 'en-NG')) {
            throw new Error('Provide a valid Nigerian mobile number');
          }
          break;
      }

      return true;
    } catch (error: unknown) {
      this.errorMessage = (error as Error).message;
      return false;
    }
  }

  defaultMessage() {
    return this.errorMessage;
  }
}

export function IsChannelValue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsChannelValueConstraint,
    });
  };
}

export class SendOtpDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(OtpChannelEnum)
  channel: OtpChannelEnum;

  @Transform(({ value, obj }) =>
    obj.channel === OtpChannelEnum.SMS
      ? getInternationalPhoneNumber(value)
      : value,
  )
  @IsChannelValue()
  value: string;
}
