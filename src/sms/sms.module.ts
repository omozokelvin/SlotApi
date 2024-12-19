import { Module } from '@nestjs/common';
import { MailModule } from '@/mail/mail.module';
import { SmsService } from '@/sms/sms.service';
import { SendChampModule } from '@/sms/sendchamp/sendchamp.module';
import { TermiiModule } from '@/sms/termii/termii.module';

@Module({
  imports: [MailModule, SendChampModule, TermiiModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
