import schemaOptions from '@/_common/constants/schema.constant';
import { enumValuesAsArray } from '@/_common/helpers/enum.helper';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { OtpChannelEnum, OtpTypeEnum } from '@/otp/otp.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ ...schemaOptions() })
export class Otp {
  @Prop({
    unique: true,
    trim: true,
    sparse: true,
  })
  value: string;

  @Prop({
    required: true,
    enum: enumValuesAsArray(OtpChannelEnum),
    type: String,
  })
  channel: OtpChannelEnum;

  @Prop({
    required: true,
    min: 6,
    max: 6,
    trim: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  isVerified: boolean;

  @Prop({
    required: true,
    enum: enumValuesAsArray(OtpTypeEnum),
    type: String,
  })
  type: OtpTypeEnum;

  @Prop({
    required: true,
    default: false,
  })
  isSent: boolean;

  @Prop({
    required: true,
  })
  userAgent: string;
}

export class IOtp extends Otp {
  id: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

export type OtpDocument = DocumentMeta<IOtp>;
