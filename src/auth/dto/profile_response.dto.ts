import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO que define la estructura de la respuesta
 * del endpoint de perfil (ej. /auth/me).
 * Representa la información del usuario (ya autenticado) que es
 * segura para devolver al cliente (sin contraseña u otros datos sensibles).
 */
export class ProfileResponseDto {
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  userId: number;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'test@example.com',
  })
  email: string;
}
