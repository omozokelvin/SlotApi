import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { TermiiWebhookEvent } from '@/sms/termii/termii.interface';
import { TermiiService } from '@/sms/termii/termii.service';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';

@Controller('termii')
@ApiTags(ApiTagsEnum.termii)
@ApiBearerAuth()
export class TermiiController {
  constructor(private readonly termiiService: TermiiService) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async processWebhook(
    @Body() body: TermiiWebhookEvent,
    @Headers() headers: Headers,
  ) {
    console.log(JSON.stringify(headers, null, 2));
    return this.termiiService.processWebhook(body);
  }
}
