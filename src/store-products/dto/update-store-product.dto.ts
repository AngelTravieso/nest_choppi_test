import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO para actualizar un item del inventario (precio o stock).
 * campos son opcionales.
 */
export class UpdateStoreProductDto {
  @ApiProperty({
    description: 'El nuevo precio de venta del producto',
    example: 24.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    description: 'El nuevo stock del producto',
    example: 150,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;
}
