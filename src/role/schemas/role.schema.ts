import schemaOptions from '@/_common/constants/schema.constant';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { Owner } from '@/_common/schemas/owner.schema';
import { ApiRoute } from '@/role/schemas/api-route.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ ...schemaOptions() })
export class Role extends Owner {
  @ApiProperty({
    example: 'Super Admin',
  })
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @ApiProperty({
    example: 'This have the super administrator rights',
  })
  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @ApiProperty({
    type: [ApiRoute],
  })
  @Prop({
    type: [
      {
        path: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
        method: {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      },
    ],
  })
  apiRoutes: Array<ApiRoute>;

  @ApiProperty({
    example: ['CAN_SET_ROLE'],
  })
  @Prop({
    type: [String],
    required: true,
  })
  operations: Array<string>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export class IRole extends Role {
  id: string;
}

export type RoleDocument = DocumentMeta<IRole>;
