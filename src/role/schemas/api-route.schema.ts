import schemaOptions from '@/_common/constants/schema.constant';
import { DocumentMeta } from '@/_common/interfaces/document.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ ...schemaOptions() })
export class ApiRoute {
  @ApiProperty({ example: '/' })
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  path: string;

  @ApiProperty({
    example: 'get',
  })
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  method: string;
}

export const ApiRouteSchema = SchemaFactory.createForClass(ApiRoute);

export class IApiRoute extends ApiRoute {
  id: string;
}

export type ApiRouteDocument = DocumentMeta<IApiRoute>;
