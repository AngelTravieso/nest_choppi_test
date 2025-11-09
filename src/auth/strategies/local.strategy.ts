import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Estrategia de Passport para validar credenciales locales (email/password).
 * Se activa automáticamente por el LocalAuthGuard.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Método de validación que Passport llama automáticamente.
   *
   * @param email El email extraído de la solicitud (body.email).
   * @param password La contraseña extraída de la solicitud (body.password).
   * @returns El objeto de usuario (sin password) si la validación es exitosa.
   * @throws {UnauthorizedException} Si authService.validateUser lanza un error.
   */
  async validate(
    email: string,
    password: string,
  ): Promise<ValidatedUserPayload> {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
