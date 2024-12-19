import { appProps } from '@/_common/config/app-props.constant';
import { EnvironmentEnum } from '@/_common/enums/environment.enum';
import { sleep } from '@/_common/helpers/promises.helper';
import { MailService } from '@/mail/mail.service';
import { SendChampService } from '@/sms/sendchamp/sendchamp.service';
import { TermiiService } from '@/sms/termii/termii.service';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum ErrorEnum {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
}

enum SmsProviderEnum {
  SENDCHAMP = 'SENDCHAMP',
  TERMII = 'TERMII',
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly lengthOfOneMessage = 160;
  private readonly costOfOneMessage = 4;
  private readonly smsSuccessMessage = 'SMS sent successfully!';
  private readonly maxRetries = 6;
  private sendChampCanSend = false;
  private termiiCanSend = false;
  private retryService: SmsProviderEnum | null = null;
  private attempt = 0;
  private delay = 1000;

  constructor(
    private readonly mailService: MailService,
    private readonly sendChampService: SendChampService,
    private readonly termiiService: TermiiService,
    private readonly configService: ConfigService,
  ) {}

  async send({ to, message }: { to: string; message: string }) {
    try {
      const environment = this.configService.get('NODE_ENV', {
        infer: true,
      });

      // Mock for development so we don't waste credit
      if (environment !== EnvironmentEnum.prod) {
        return this.smsSuccessMessage;
      }

      if (!this.attempt) {
        const [sendChampBalance, termiiBalance] = await Promise.all([
          this.sendChampService.getBalance(),
          this.termiiService.getBalance(),
        ]);

        const messageCount = Math.ceil(
          message.length / this.lengthOfOneMessage,
        );

        const smsPrice = this.costOfOneMessage * messageCount;

        this.termiiCanSend = termiiBalance > smsPrice;
        this.sendChampCanSend = sendChampBalance > smsPrice;

        this.retryService = this.sendChampCanSend
          ? SmsProviderEnum.SENDCHAMP
          : this.termiiCanSend
            ? SmsProviderEnum.TERMII
            : null;

        this.logger.log({
          smsPrice,
          sendChampBalance,
          termiiBalance,
          sendChampCanSend: this.sendChampCanSend,
          termiiCanSend: this.termiiCanSend,
          retryService: this.retryService,
        });

        if (!this.retryService) {
          throw new Error(ErrorEnum.INSUFFICIENT_BALANCE);
        }
      }

      if (
        this.sendChampCanSend &&
        this.retryService === SmsProviderEnum.SENDCHAMP
      ) {
        const response = await this.sendChampService
          .sendSms(to, message)
          .catch(() => {
            this.retryService = this.termiiCanSend
              ? SmsProviderEnum.TERMII
              : SmsProviderEnum.SENDCHAMP;
          });

        this.logger.log({ sendchamp: response });
        return this.smsSuccessMessage;
      }

      if (this.termiiCanSend && this.retryService === SmsProviderEnum.TERMII) {
        const response = await this.termiiService
          .sendSms(to, message)
          .catch(() => {
            this.retryService = this.sendChampCanSend
              ? SmsProviderEnum.SENDCHAMP
              : SmsProviderEnum.TERMII;
          });

        this.logger.log({ termii: response });
        return this.smsSuccessMessage;
      }
    } catch (error) {
      this.logger.error(error);

      const errorMessage = (error as any)?.message || 'Failed to send SMS';

      if (errorMessage === ErrorEnum.INSUFFICIENT_BALANCE) {
        this.insufficientCreditAlert();

        throw new UnprocessableEntityException(
          'Insufficient balance to send SMS',
        );
      }

      if (this.attempt <= this.maxRetries) {
        await sleep(this.delay);

        this.attempt++;
        this.delay = this.delay * 2; // Exponential backoff

        return this.send({ to, message });
      } else {
        throw new UnprocessableEntityException(errorMessage);
      }
    }
  }

  private insufficientCreditAlert() {
    this.mailService
      .send({
        to: appProps().adminEmail,
        subject: 'Insufficient balance to send SMS',
        body: `SMS failed to send because we have insufficient credit, this is causing our system to fail, please go and recharge`,
      })
      .then()
      .catch((error) =>
        this.logger.error(
          error?.message || 'failed to send insufficient credit mail',
        ),
      );
  }
}
