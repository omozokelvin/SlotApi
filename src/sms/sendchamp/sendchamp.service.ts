import { handleAxiosError } from '@/_common/helpers/http.helper';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import {
  SendChampSuccess,
  SendChampSmsWalletBalance,
  SendChampSmsSent,
  SendChampSmsRouteEnum,
  SendchampWebhookEvent,
} from '@/sms/sendchamp/sendchamp.interface';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class SendChampService {
  private readonly logger = new Logger(SendChampService.name);
  private readonly sendChampUrl = 'https://api.sendchamp.com/api/v1/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async getBalance() {
    try {
      const response = await lastValueFrom(
        this.httpService
          .post<SendChampSuccess<SendChampSmsWalletBalance>>(
            this.sendChampUrl + 'wallet/wallet_balance',
            null,
            {
              ...this.requestConfig(this.sendChampAuthorization()),
            },
          )
          .pipe(
            map(({ data }) => {
              return data;
            }),
            catchError(handleAxiosError),
          ),
      );

      return +response?.data?.wallet_balance || 0;
    } catch (error) {
      return 0;
    }
  }

  async sendSms(to: string, message: string) {
    return await lastValueFrom(
      this.httpService
        .post<SendChampSuccess<SendChampSmsSent>>(
          this.sendChampUrl + 'sms/send',
          {
            to,
            message,
            sender_name: 'SAlert',
            route: SendChampSmsRouteEnum.DND,
          },
          {
            ...this.requestConfig(this.sendChampAuthorization()),
          },
        )
        .pipe(
          map(({ data }) => {
            return data;
          }),
          catchError(handleAxiosError),
        ),
    );
  }

  async processWebhook(event: SendchampWebhookEvent) {
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
}
