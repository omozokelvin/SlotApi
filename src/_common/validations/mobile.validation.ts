import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { validMobileNumber } from '@/_common/helpers/mobile.helper';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'mobile-number-constraint', async: false })
@Injectable()
// mark as deprecated
export class ValidMobileNumber implements ValidatorConstraintInterface {
  private errorMessage = '';

  validate(mobileNumber: string) {
    try {
      if (!mobileNumber || !validMobileNumber(mobileNumber)) {
        throw new Error(ErrorMessages.PROVIDE_VALID_MOBILE_NUMBER);
      }

      return true;
    } catch (error: any) {
      this.errorMessage = error.message;
      return false;
    }
  }

  defaultMessage() {
    return this.errorMessage;
  }
}
