import { TokenService } from '@/auth/services/token.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<boolean>> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      return next.handle();
    }

    const decodedAccessToken = await this.tokenService.decodeAccessToken(token);

    if (!decodedAccessToken) {
      return next.handle();
    }

    const { jwtid: refreshTokenId } = decodedAccessToken;

    const refreshToken = await this.tokenService.findById(refreshTokenId);

    if (!refreshToken) {
      return next.handle();
    }

    this.tokenService.deleteRefreshToken(refreshTokenId);

    return next.handle();
  }
}
