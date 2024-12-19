import { EmailDto } from '@/_common/dtos/email.dto';
import { MobileNumberDto } from '@/_common/dtos/mobile-number.dto';
import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends IntersectionType(EmailDto, MobileNumberDto) {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsIn([true], { message: 'The value must be true' })
  acceptTerms: boolean;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    !!value?.trim() ? value?.trim()?.toUpperCase() : undefined,
  )
  referredBy?: string;
}
