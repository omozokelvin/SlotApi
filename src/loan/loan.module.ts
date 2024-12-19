import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from '@/loan/schemas/loan.schema';
import { LoanController } from '@/loan/loan.controller';
import { LoanService } from '@/loan/loan.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Loan.name,
        schema: LoanSchema,
      },
    ]),
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
