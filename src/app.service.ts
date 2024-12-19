import { appProps } from '@/_common/config/app-props.constant';
import { responder } from '@/_common/helpers/responder.helper';
import { EnvironmentVariables } from '@/_common/validations/environment.validation';
import { MailService } from '@/mail/mail.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Connection } from 'mongoose';

export class ReadinessCheckResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty({ type: String, isArray: true })
  reasons: string[];
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectConnection() private connection: Connection,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly mailService: MailService,
  ) {}

  healthCheck() {
    // debugger;
    return responder.success('Live and running, God is good!', {
      environment: this.configService.get('NODE_ENV', { infer: true }),
      status: 'UP',
      uptime: `${process.uptime()} seconds`,
    });
  }

  // TODO: test connection to SES, S3
  async readinessCheck(): Promise<ReadinessCheckResponseDto> {
    let status = 'UP';
    const reasons = [];

    // db check
    try {
      await this.connection.db.admin().ping();

      reasons.push('DB OK');
    } catch (error) {
      status = 'DOWN';
      reasons.push('Unable to connect with DB.');
      this.logger.error(error);
    }

    // mailer check

    try {
      await this.mailService.send({
        to: appProps().adminEmail,
        subject: 'SES ping',
        body: 'SES ping from readiness check',
        throwError: true,
      });

      reasons.push('SES OK');
    } catch (error) {
      status = 'DOWN';
      reasons.push('Unable to connect with SES.');
      this.logger.error(error);
    }

    // if any checks fail, report an error
    if (status !== 'UP') {
      throw new InternalServerErrorException({ status, reasons });
    }

    return { status, reasons };
  }
}
