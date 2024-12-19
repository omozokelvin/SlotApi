import { LoanStatusEnum } from '@/loan/loan.enum';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateLoanDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'email',
] as const) {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  loanAmount: number;

  @IsNotEmpty()
  @IsEnum(LoanStatusEnum)
  loanStatus: LoanStatusEnum;

  @IsNotEmpty()
  @IsString()
  reference: string;
}
