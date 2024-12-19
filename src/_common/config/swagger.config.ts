import { appProps } from '@/_common/config/app-props.constant';
import { EnvironmentEnum } from '@/_common/enums/environment.enum';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app) {
  const environment = process.env.NODE_ENV as EnvironmentEnum;

  if (environment !== EnvironmentEnum.prod) {
    const config = new DocumentBuilder()
      .setTitle(appProps().name)
      .setDescription(appProps().description)
      .setVersion(appProps().version)
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (_: string, methodKey: string) => methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);
  }
}
