import schemaOptions from '@/_common/constants/schema.constant';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { User } from '@/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ ...schemaOptions() })
export class RefreshToken {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  user: User | string;

  @Prop({
    default: false,
  })
  isRevoked: boolean;

  @Prop({
    required: true,
  })
  expiresAt: Date;

  @Prop()
  userAgent?: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

export interface IRefreshToken extends RefreshToken {
  id: string;
}

export type RefreshTokenDocument = DocumentMeta<RefreshToken>;
