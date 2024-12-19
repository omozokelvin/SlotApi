import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'sort-constraint', async: false })
@Injectable()
export class SortQueryConstraint implements ValidatorConstraintInterface {
  private errorMessage = '';

  validate(sort: string, validationArguments: ValidationArguments) {
    try {
      const { constraints: fields } = validationArguments;

      const [fieldName, sortOrder] = sort.split(',');

      if (
        !sort.endsWith(',asc') &&
        !sort.endsWith(',ASC') &&
        !sort.endsWith(',desc') &&
        !sortOrder.endsWith(',DESC')
      ) {
        throw new Error(ErrorMessages.SORT_ORDER_ERROR);
      }

      if (!fields.includes(fieldName)) {
        throw new Error(ErrorMessages.sortField(fields));
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
