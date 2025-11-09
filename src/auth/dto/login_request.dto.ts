import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para el cuerpo de la solicitud de login.
 * Define la estructura y validaciones esperadas.
 */
export class LoginRequestDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
