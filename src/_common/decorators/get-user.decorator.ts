import { IUser } from '@/user/schemas/user.schema';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isNotEmptyObject } from 'class-validator';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser | null => {
    const request = ctx.switchToHttp().getRequest();

    return isNotEmptyObject(request?.user) ? (request.user as IUser) : null;
  },
);
