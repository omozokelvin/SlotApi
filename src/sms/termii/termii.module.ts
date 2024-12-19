import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TermiiService } from '@/sms/termii/termii.service';
import { TermiiController } from '@/sms/termii/termii.controller';

@Module({
  controllers: [TermiiController],
  imports: [HttpModule],
  providers: [TermiiService],
  exports: [TermiiService],
})
export class TermiiModule {}
