import { BYPASS_RESPONSE_TRANSFORM } from '@/_common/constants/decorator-keys.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  // private readonly logger = new Logger('TransformResponseInterceptor');

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T> | any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();

    const bypass = this.reflector.getAllAndOverride<boolean>(
      BYPASS_RESPONSE_TRANSFORM,
      [context.getHandler(), context.getClass()],
    );

    if (bypass) {
      return next.handle();
    }

    const { statusCode: status } = response;

    return next.handle().pipe(
      map((responseData) => {
        let data = responseData || null;
        let message = 'Success';
        let meta = null;

        if (typeof responseData === 'string') {
          message = 'Success';
          data = responseData;
        } else if (typeof responseData === 'boolean') {
          message = 'Success';
          data = responseData;
        } else if (!responseData?.hasOwnProperty('message')) {
          data = responseData?.data || responseData;
          meta = responseData?.meta || null;
        } else {
          data = responseData?.data;
          message = responseData?.message;
          meta = responseData?.meta;
        }

        return {
          message,
          data: data ?? null,
          status,
          success: true,
          ...(meta && { meta }),
        };
      }),
    );
  }
}
