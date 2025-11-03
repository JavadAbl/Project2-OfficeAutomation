// get-many-query.request.ts
import { IsOptional, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetManyQueryRequest {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  search?: string;
}
