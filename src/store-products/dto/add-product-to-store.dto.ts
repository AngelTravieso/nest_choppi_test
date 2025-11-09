import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

/**
 * DTO para añadir un producto al inventario de una tienda.
 * Define el producto, su precio y stock inicial.
 */
export class AddProductToStoreDto {
  @ApiProperty({
    description: 'ID del producto (del catálogo general) a añadir',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Precio de venta del producto *en esta tienda*',
    example: 25.99,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Stock inicial del producto en esta tienda',
    example: 100,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;
}
