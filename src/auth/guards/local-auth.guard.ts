import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Un Guard personalizado que invoca la estrategia 'local' de Passport.
 *
 * Al aplicar este Guard (ej. @UseGuards(LocalAuthGuard)) a un endpoint
 * (como /auth/login), NestJS ejecutará automáticamente la `LocalStrategy`
 * para validar las credenciales (email/password) del `body` de la solicitud.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
