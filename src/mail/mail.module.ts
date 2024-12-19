import { awsConfig } from '@/_common/config/environment.config';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import { MailService } from '@/mail/mail.service';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        const from = configService.get('MAIL_FROM', {
          infer: true,
        });

        const logger = new Logger('MailerModule');

        try {
          const transport = {
            SES: {
              ses: new SESClient(awsConfig()),
              aws: { SendRawEmailCommand },
            },
          };

          return {
            transport,
            defaults: {
              from,
            },
            preview: false,
            template: {
              dir: process.cwd() + '/templates/mail/pages',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
            options: {
              partials: {
                dir: process.cwd() + '/templates/mail/partials',
                options: {},
              },
            },
          };
        } catch (error) {
          logger.error(
            'Error configuring MailerModule',
            (error as Error).stack,
          );
          throw error;
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
