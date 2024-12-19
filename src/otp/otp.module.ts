import { MailModule } from '@/mail/mail.module';
import { OtpService } from '@/otp/otp.service';
import { Otp, OtpSchema } from '@/otp/schemas/otp.schema';
import { SmsModule } from '@/sms/sms.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Otp.name,
        schema: OtpSchema,
      },
    ]),
    MailModule,
    UserModule,
    SmsModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
