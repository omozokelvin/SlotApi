import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';
import { AppService } from '@/app.service';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags(ApiTagsEnum.default)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Get('health')
  getHello() {
    return this.appService.healthCheck();
  }

  @HttpCode(HttpStatus.OK)
  @Get('readiness')
  getReadiness() {
    return this.appService.readinessCheck();
  }
}
