import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function setupValidation(app) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
      skipMissingProperties: false,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const transformed = validationErrors.map((allErrors) => {
          const error = Object.values(allErrors.constraints)[0];

          return {
            field: allErrors.property,
            error,
          };
        });

        return new BadRequestException(transformed[0]?.error);
      },
    }),
  );
}
