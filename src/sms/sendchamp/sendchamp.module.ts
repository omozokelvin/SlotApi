import { Module } from '@nestjs/common';
import { SendChampService } from './sendchamp.service';
import { HttpModule } from '@nestjs/axios';
import { SendChampController } from '@/sms/sendchamp/sendchamp.controller';

@Module({
  controllers: [SendChampController],
  imports: [HttpModule],
  providers: [SendChampService],
  exports: [SendChampService],
})
export class SendChampModule {}
