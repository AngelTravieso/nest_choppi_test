import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO que define la estructura de la respuesta
 * exitosa del endpoint de login. Contiene el token de acceso (JWT)
 * generado para el usuario.
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
