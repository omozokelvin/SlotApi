import { setupCors } from '@/_common/config/cors.config';
import { syncRoutes } from '@/_common/config/routes.config';
import { sentryConfig } from '@/_common/config/sentry.config';
import { setupSwagger } from '@/_common/config/swagger.config';
import { setupValidation } from '@/_common/config/validation.config';
import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import helmet from 'helmet';

Sentry.init(sentryConfig());

async function bootstrap() {
  process.env.TZ = 'Africa/Lagos';

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(helmet());

  setupValidation(app);

  setupCors(app);

  setupSwagger(app);

  await syncRoutes(app);

  await app.listen(process.env.PORT);
}

bootstrap();
