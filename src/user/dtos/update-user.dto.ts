import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['referredBy', 'acceptTerms'] as const),
) {
  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  @IsString()
  activeCar?: string;

  @IsOptional()
  @IsBoolean()
  onboarded?: boolean;

  @IsOptional()
  @IsUrl()
  photo?: string;
}
