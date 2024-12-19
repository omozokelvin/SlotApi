import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SendChampService } from '@/sms/sendchamp/sendchamp.service';
import { SendchampWebhookEvent } from '@/sms/sendchamp/sendchamp.interface';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';

@Controller('sendchamp')
@ApiTags(ApiTagsEnum.sendchamp)
@ApiBearerAuth()
export class SendChampController {
  constructor(private readonly sendChampService: SendChampService) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async processsendChampHook(
    @Body() body: SendchampWebhookEvent,
    @Headers() headers: Headers,
  ) {
    console.log(JSON.stringify(headers, null, 2));
    return this.sendChampService.processWebhook(body);
  }
}
