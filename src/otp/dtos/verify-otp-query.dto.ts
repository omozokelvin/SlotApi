import { IsString } from 'class-validator';

export class VerifyOtpQueryDto {
  @IsString()
  hash: string;
}
