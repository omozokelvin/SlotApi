import { appProps } from '@/_common/config/app-props.constant';
import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { SuccessMessages } from '@/_common/constants/success-messages.constant';
import { MessageDto } from '@/_common/dtos/response.dto';
import { responder } from '@/_common/helpers/responder.helper';
import { generateRandomNumbers } from '@/_common/helpers/string.helper';
import { MailService } from '@/mail/mail.service';
import { SendOtpDto } from '@/otp/dtos/send-otp.dto';
import { VerifyOtpDto } from '@/otp/dtos/verify-otp.dto';
import { OtpChannelEnum, OtpTypeEnum } from '@/otp/otp.enum';
import { IOtp, Otp, OtpDocument } from '@/otp/schemas/otp.schema';
import { SmsService } from '@/sms/sms.service';
import { IUser } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, DeleteResult, Model } from 'mongoose';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  private readonly expirationMinutes = appProps().otpExpirationSeconds / 60;

  constructor(
    @InjectModel(Otp.name) private readonly model: Model<IOtp>,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly smsService: SmsService,
  ) {}

  async sendOtp(
    body: SendOtpDto,
    userAgent: string,
    session: ClientSession = null,
  ): Promise<MessageDto> {
    await this.validateSendOtp(body, session);

    let otpDocument = await this.model.findOne<OtpDocument>(body, null, {
      lean: false,
      session,
    });

    // If otp does not exits or expired, generate a new one otherwise resend existing
    const code =
      !otpDocument || this.isOtpExpired(otpDocument?.updatedAt)
        ? generateRandomNumbers()
        : otpDocument.code;

    //TODO: Check how this will work on mobile
    if (otpDocument) {
      otpDocument.code = code;
      otpDocument.isSent = false;
      otpDocument.isVerified = false;
      otpDocument.userAgent = userAgent;

      await otpDocument.save({ session });
    } else {
      const otpDocuments = await this.model.create(
        [
          {
            value: body.value,
            isVerified: false,
            isSent: false,
            code: code,
            channel: body.channel,
            type: body.type,
            userAgent,
          },
        ],
        { session },
      );

      otpDocument = otpDocuments[0];
    }

    const expirationMinutes = this.expirationMinutes;

    switch (body.channel) {
      case OtpChannelEnum.EMAIL:
        await this.mailService.sendOtp({
          to: otpDocument.value,
          code: otpDocument.code,
          expirationMinutes,
        });
        break;

      case OtpChannelEnum.SMS:
        await this.smsService.send({
          to: otpDocument.value,
          message: `Your Slot OTP is ${otpDocument.code}. It will expire in ${expirationMinutes} minutes.`,
        });
        break;
    }

    await otpDocument.updateOne({ isSent: true });

    return responder.success(
      SuccessMessages.otpSent(otpDocument.value, otpDocument.channel),
    );
  }

  async verifyOtp(body: VerifyOtpDto): Promise<MessageDto> {
    const otpDocument = await this.validateVerifyOtp(body);

    otpDocument.isVerified = true;

    await otpDocument.save();

    return responder.success(
      SuccessMessages.otpVerified(body.value, body.channel),
    );
  }

  async deleteUsedOtp(body: SendOtpDto, session: ClientSession = null) {
    try {
      await this.model.findOneAndDelete(body, { session });
    } catch (error) {
      this.logger.error((error as Error)?.message || error);
    }
  }

  async validateIfOtpIsVerified(
    body: SendOtpDto,
    session: ClientSession = null,
  ): Promise<IOtp> {
    const otp = await this.model.findOne({ ...body, isVerified: true }, null, {
      session,
    });

    if (!otp) {
      switch (body.channel) {
        case OtpChannelEnum.EMAIL:
          throw new BadRequestException(
            'OTP verification via email is required',
          );

        case OtpChannelEnum.SMS:
          throw new BadRequestException(
            'OTP verification via mobile verification is required',
          );

        default:
          throw new BadRequestException('Invalid OTP channel');
      }
    }

    return otp?.toObject();
  }

  async deleteAllForUser(
    user: IUser,
    session: ClientSession = null,
  ): Promise<DeleteResult> {
    return this.model.deleteMany(
      {
        $or: [
          {
            value: user.email,
            channel: OtpChannelEnum.EMAIL,
          },
          {
            value: user.mobileNumber,
            channel: OtpChannelEnum.SMS,
          },
        ],
      },
      { session },
    );
  }

  private getExpirationDate(updatedAt: Date = new Date()): Date {
    const expires = new Date(updatedAt);

    expires.setTime(
      updatedAt.getTime() + appProps().otpExpirationSeconds * 1000,
    );

    return expires;
  }

  private async validateVerifyOtp(body: VerifyOtpDto) {
    const otpDocument = (await this.model.findOne(
      {
        channel: body.channel,
        type: body.type,
        value: body.value,
      },
      null,
      { lean: false },
    )) as OtpDocument;

    if (!otpDocument) {
      throw new BadRequestException(ErrorMessages.REQUEST_OTP_CODE);
    }

    if (this.isOtpExpired(otpDocument?.updatedAt)) {
      throw new BadRequestException(ErrorMessages.EXPIRED_OTP_CODE);
    }

    if (otpDocument.code !== body.code) {
      throw new BadRequestException(ErrorMessages.otpCodeMismatch(body.value));
    }

    if (otpDocument.isVerified) {
      throw new BadRequestException(ErrorMessages.ALREADY_VERIFIED_OTP);
    }

    if (!otpDocument.isSent) {
      throw new BadRequestException(ErrorMessages.OTP_NOT_SENT);
    }

    return otpDocument;
  }

  private async validateSendOtp(
    body: SendOtpDto,
    session: ClientSession = null,
  ) {
    if (body.type == OtpTypeEnum.REGISTRATION) {
      let user = null;

      user = await this.userService.model.findOne(
        {
          [body.channel === OtpChannelEnum.EMAIL ? 'email' : 'mobileNumber']:
            body.value,
          password: { $exists: false },
        },
        null,
        { session },
      );

      if (!user) {
        throw new BadRequestException('Please start the registration process');
      }
    }

    if (body.type == OtpTypeEnum.CHANGE_PASSWORD) {
      const user = await this.userService.model.findOne(
        {
          email: body.value,
          password: {
            $exists: true,
          },
        },
        null,
        { session },
      );

      if (!user) {
        throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
      }
    }

    if (body.type == OtpTypeEnum.UPDATE_PROFILE) {
      let user = null;

      user = await (body.channel === OtpChannelEnum.EMAIL
        ? this.userService.findByEmail(body.value, session)
        : this.userService.findByMobileNumber(body.value, session));

      if (user) {
        throw new BadRequestException(
          ErrorMessages.userAlreadyExist(body.value),
        );
      }
    }
  }

  private isOtpExpired(updatedAt: Date): boolean {
    const expirationDate = this.getExpirationDate(updatedAt);

    return new Date() > expirationDate;
  }
}
