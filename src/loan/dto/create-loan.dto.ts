import { LoanStatusEnum } from '@/loan/loan.enum';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateLoanDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'email',
] as const) {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsEnum(LoanStatusEnum)
  status: LoanStatusEnum;
}
