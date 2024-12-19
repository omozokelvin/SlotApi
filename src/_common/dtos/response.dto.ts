import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class MessageDto {
  message: string;
}

export class ApiResponse<T = null> extends MessageDto {
  data: T;
}

export class PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;
}

export class PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

export class Pagination {
  meta: PaginationMeta;
}
