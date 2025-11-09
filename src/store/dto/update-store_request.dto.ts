import { PartialType } from '@nestjs/swagger';
import { CreateStoreRequestDto } from './create_store_request.dto';

/**
 * DTO para la actualización de una Tienda (Store).
 * Hereda de CreateStoreDto pero marca todos los campos como opcionales.
 */
export class UpdateStoreRequestDto extends PartialType(CreateStoreRequestDto) {}
