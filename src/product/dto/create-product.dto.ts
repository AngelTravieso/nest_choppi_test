import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  MinLength,
} from 'class-validator';

/**
 * DTO para la creación de un Producto.
 * Define la estructura y validaciones de los datos de entrada.
 */
export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop XYZ',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto (opcional)',
    example: 'Una laptop potente para desarrollo',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Precio base del producto (antes de inventario)',
    example: 1500.99,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number) // Transforma el string (ej. de form-data) a número
  price: number;
}
