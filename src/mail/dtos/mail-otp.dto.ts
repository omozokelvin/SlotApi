import { IsNumber, IsString } from 'class-validator';

export class MailOtpDto {
  @IsString()
  to: string;

  @IsString()
  code: string;

  @IsNumber()
  expirationMinutes: number;
}
