import { EnvironmentEnum } from '@/_common/enums/environment.enum';
import { plainToClass } from 'class-transformer';
import { IsInt, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  NODE_ENV: EnvironmentEnum;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  MAIL_FROM: string;

  @IsString()
  S3_BUCKET_AWS: string;

  @IsString()
  SENTRY_AUTH_TOKEN: string;

  @IsString()
  SENDCHAMP_PUBLIC_KEY: string;

  @IsString()
  TERMII_API_KEY: string;

  // this is optional, because we can read them off AWS and we don't need to explicity set them
  @IsOptional()
  @IsString()
  ACCESS_KEY_AWS: string;

  @IsOptional()
  @IsString()
  SECRET_KEY_AWS: string;

  @IsOptional()
  @IsInt()
  PORT: number;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
