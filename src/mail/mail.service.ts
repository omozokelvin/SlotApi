import { appProps } from '@/_common/config/app-props.constant';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import { MailOtpDto } from '@/mail/dtos/mail-otp.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateOrReject } from 'class-validator';

interface SendMailPayload {
  to: string;
  subject: string;
  body: string;
  firstName?: string;
  throwError?: boolean;
}
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly from = this.configService.get('MAIL_FROM', { infer: true });

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async sendOtp(options: MailOtpDto) {
    const subject = `${appProps().name} - Email Verification`;

    await validateOrReject(options);

    const { to, code: otp, expirationMinutes } = options;

    return this.mailerService.sendMail({
      to: to,
      from: this.from,
      subject,
      template: 'send-otp',
      context: {
        subject,
        otp,
        expirationMinutes,
        ...appProps(),
      },
    });
  }

  async sendWelcomeEmail(to: string, fullName: string) {
    const subject = `Welcome to ${appProps().name}`;

    return this.mailerService.sendMail({
      to,
      from: this.from,
      subject,
      template: 'welcome',
      context: {
        subject,
        fullName,
        ...appProps(),
      },
    });
  }

  async send(payload: SendMailPayload) {
    const { to, subject, throwError, ...rest } = payload;

    return await this.mailerService
      .sendMail({
        to,
        from: this.from,
        subject,
        template: 'send-mail',
        context: {
          ...appProps(),
          ...rest,
        },
      })
      .then()
      .catch((error) => {
        this.logger.error(error?.message || error);

        if (throwError) {
          throw error;
        }
      });
  }
}
