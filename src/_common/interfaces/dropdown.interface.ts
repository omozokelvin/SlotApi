import { ApiProperty } from '@nestjs/swagger';

export class DropDownOption {
  @ApiProperty({
    type: String,
  })
  label: string;

  @ApiProperty({
    type: String,
  })
  value: string;
}
