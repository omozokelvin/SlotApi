import schemaOptions from '@/_common/constants/schema.constant';
import { enumValuesAsArray } from '@/_common/helpers/enum.helper';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { LoanStatusEnum } from '@/loan/loan.enum';
import { OtpChannelEnum } from '@/otp/otp.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ ...schemaOptions() })
export class Loan {
  @Prop({
    required: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    email: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
    enum: enumValuesAsArray(OtpChannelEnum),
    type: String,
  })
  status: LoanStatusEnum;

  @Prop({
    required: true,
    trim: true,
  })
  reference: string;
}
export class ILoan extends Loan {
  id: string;
}

export type LoanDocument = DocumentMeta<Loan>;

export const LoanSchema = SchemaFactory.createForClass(Loan);
