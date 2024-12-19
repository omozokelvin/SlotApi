import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(ChangePasswordDto, [
  'email',
  'password',
] as const) {}
