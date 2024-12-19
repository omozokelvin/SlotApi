import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

Injectable();
export class PayloadExistsPipe implements PipeTransform {
  transform(payload: any) {
    if (!Object.keys(payload).length) {
      throw new BadRequestException(ErrorMessages.EMPTY_PAYLOAD);
    }

    return payload;
  }
}
