import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AssignRoleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles: string[];
}
