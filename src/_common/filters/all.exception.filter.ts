import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // @WithSentry()
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message;
    const code = exception?.code;

    if (code === 11000) {
      message = `Duplicate error: ${
        Object.keys(exception.keyPattern)[0]
      } already exists`;
    }

    response.status(statusCode).json({
      message,
      error: exception?.response?.error || exception,
      statusCode,
    });
  }
}
