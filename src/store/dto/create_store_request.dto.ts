import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * DTO para la creación de una Tienda (Store).
 * Define los campos requeridos y sus validaciones.
 */
export class CreateStoreRequestDto {
  @ApiProperty({
    description: 'El nombre de la tienda',
    example: 'Bodega Central',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'La dirección de la tienda (opcional)',
    example: 'Av. Principal 123',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}
