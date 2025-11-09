import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para la actualización de un Producto.
 * Hereda de CreateProductDto y marca todos los campos como opcionales.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
