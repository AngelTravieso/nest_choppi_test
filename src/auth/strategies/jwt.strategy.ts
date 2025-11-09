import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../interfaces/user-payload.interface';

/**
 * Estrategia de Passport para validar JSON Web Tokens (JWT).
 * Se encarga de extraer el token del header, verificar su firma
 * y expiración, y decodificar su payload.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET no esta definido en la configuracion');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Passport verifica la firma y expiración del JWT automáticamente.
   * Si es válido, este método se llama con el payload decodificado.
   *
   * @param payload El payload decodificado del JWT.
   * @returns El objeto que se adjuntará a request.user.
   */
  async validate(payload: Promise<UserPayload>) {
    // Lo que retornemos aquí se adjuntará a request.user
    return { userId: (await payload).userId, email: (await payload).email };
  }
}
