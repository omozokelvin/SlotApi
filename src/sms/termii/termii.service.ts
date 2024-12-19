import { handleAxiosError } from '@/_common/helpers/http.helper';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import {
  TermiiBalanceSuccess,
  TermiiSmsChannelEnum,
  TermiiSmsSuccess,
  TermiiSmsTypeEnum,
  TermiiWebhookEvent,
} from '@/sms/termii/termii.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map, catchError } from 'rxjs';

@Injectable()
export class TermiiService {
  private readonly logger = new Logger(TermiiService.name);
  private readonly termiiUrl = 'https://v3.api.termii.com/api/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async getBalance() {
    try {
      const response = await lastValueFrom(
        this.httpService
          .get<TermiiBalanceSuccess>(this.termiiUrl + 'get-balance', {
            params: {
              api_key: this.termiiApiKey(),
            },
          })
          .pipe(
            map(({ data }) => {
              return data;
            }),
            catchError(handleAxiosError),
          ),
      );

      this.logger.log(response);

      return +response?.balance || 0;
    } catch (error) {
      this.logger.error(error);

      return 0;
    }
  }

  async sendSms(to: string, sms: string) {
    return await lastValueFrom(
      this.httpService
        .post<TermiiSmsSuccess>(this.termiiUrl + 'sms/send', {
          api_key: this.termiiApiKey(),
          to,
          from: 'fastbeep',
          sms,
          type: TermiiSmsTypeEnum.PLAIN,
          channel: TermiiSmsChannelEnum.GENERIC,
        })
        .pipe(
          map(({ data }) => {
            this.logger.log({ data });
            return data;
          }),
          catchError(handleAxiosError),
        ),
    );
  }

  async processWebhook(event: TermiiWebhookEvent) {
    this.logger.log(`Processing webhook event`, event);

    return true;

    // const secretHash = this.configService.get('FLUTTERWAVE_SECRET_HASH', {
    //   infer: true,
    // });

    // if (!signature || signature !== secretHash) {
    //   throw new UnauthorizedException();
    // }

    // let processed = false;

    // switch (event.event) {
    //   case 'charge.completed':
    //     // processed = await this.subscriptionService.flutterwaveChargeComplete(
    //     //   event.data,
    //     // );
    //     break;

    //   default:
    //     throw new BadRequestException('Unhandled payment event');
    // }

    // return processed;
  }

  private sendChampAuthorization() {
    return `Bearer ${this.configService.get('SENDCHAMP_PUBLIC_KEY')}`;
  }

  private requestConfig(Authorization?: string): AxiosRequestConfig {
    return {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(!!Authorization && { Authorization }),
      },
    };
  }

  private termiiApiKey() {
    return this.configService.get('TERMII_API_KEY', { infer: true });
  }
}
