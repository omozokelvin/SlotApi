import { ApiRouteDto } from '@/role/dtos/api-route.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Super Admin',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [ApiRouteDto],
  })
  @IsArray()
  // @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ApiRouteDto)
  apiRoutes: Array<ApiRouteDto>;

  @ApiProperty({
    example: 'Manages all super admin role',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: ['SUPER_ADMIN'],
  })
  @IsString({ each: true })
  operations: string[];
}
export { ApiRouteDto };
