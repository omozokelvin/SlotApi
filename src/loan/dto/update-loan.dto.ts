import { CreateLoanDto } from '@/loan/dto/create-loan.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {}
