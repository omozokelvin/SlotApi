import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { Injectable } from '@nestjs/common';
import {
  isMongoId,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'id-constraint', async: false })
@Injectable()
class ValidIdConstraint implements ValidatorConstraintInterface {
  private errorMessage = '';

  validate(id: string) {
    try {
      if (!!id && !isMongoId(id)) {
        throw new Error(ErrorMessages.INVALID_ID);
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

export function IsValidId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidIdConstraint,
    });
  };
}
