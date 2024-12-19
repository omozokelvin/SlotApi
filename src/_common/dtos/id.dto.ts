import { IsValidId } from '@/_common/validations/id.validation';
import { IsString } from 'class-validator';

export class IdDto {
  @IsString()
  @IsValidId()
  id: string;
}
