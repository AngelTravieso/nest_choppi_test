import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IsBooleanString, IsOptional } from 'class-validator';

export class GetStoreProductsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsBooleanString()
  inStock?: string;
}
