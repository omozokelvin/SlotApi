import { User } from '@/user/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';

// please make sure ref matches User.name but pass it as string here to avoid dependency injection
// don't use User.name directly here
@Injectable()
export class Owner {
  @ApiProperty({
    type: String,
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'user',
  })
  createdBy?: User | string;

  @ApiProperty({
    type: String,
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'user',
  })
  updatedBy?: User | string;
}
