import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApiRouteDto {
  @ApiProperty({ example: '/' })
  @IsString()
  path: string;

  @ApiProperty({
    example: 'get',
  })
  @IsString()
  method: string;
}
