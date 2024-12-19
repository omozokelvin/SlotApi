import schemaOptions from '@/_common/constants/schema.constant';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { Role } from '@/role/schemas/role.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ ...schemaOptions() })
export class User {
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
    unique: true,
    trim: true,
    lowercase: true,
    email: true,
  })
  email: string;

  @Prop({
    unique: true,
    trim: true,
    uppercase: true,
    required: true,
  })
  referralCode: string;

  @Prop({
    default: false,
  })
  emailVerified: boolean;

  @Prop({
    default: false,
  })
  mobileVerified: boolean;

  @Prop({
    default: false,
  })
  passwordSet: boolean;

  @Prop({
    unique: true,
    trim: true,
    sparse: true,
    default: undefined,
  })
  mobileNumber?: string;

  // this could be an object to track various state
  @Prop({
    default: false,
  })
  onboarded?: boolean;

  // a derivate of the first and last name for easy search
  @Prop({
    trim: true,
  })
  fullName?: string;

  @ApiProperty({
    type: String,
  })
  @Prop({
    default: undefined,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  referredBy?: User | string;

  // a list of roles that the user has
  @ApiProperty({
    type: [String],
  })
  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: Role.name,
      },
    ],
    sparse: true,
    default: undefined,
    unique: false,
  })
  roles?: Array<Role | string>;

  @Prop({
    trim: true,
    unique: true,
    sparse: true,
    default: undefined,
  })
  photo?: string;

  @Prop({
    default: undefined,
  })
  pushToken?: string;

  @Prop()
  acceptTerms?: boolean;

  @Prop({
    select: false,
    default: undefined,
  })
  blocked?: boolean;

  @Exclude()
  @ApiHideProperty()
  @Prop({
    select: false,
  })
  password?: string;
}
export class IUser extends User {
  id: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export type UserDocument = DocumentMeta<User>;

export const UserSchema = SchemaFactory.createForClass(User);
