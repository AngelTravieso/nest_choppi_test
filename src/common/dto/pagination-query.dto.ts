import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsString()
  q?: string;
}
