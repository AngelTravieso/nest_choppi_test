import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { IsBooleanString, IsOptional } from 'class-validator';

/**
 * DTO para los queries de paginación y filtro del inventario de una tienda.
 * Extiende la paginación base (page, limit, q) y añade filtros específicos.
 */
export class GetStoreProductsQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Filtrar por productos que tienen stock (true) o no (false)',
    example: 'true',
    required: false,
  })
  @IsOptional()
  @IsBooleanString()
  inStock?: string;
}
