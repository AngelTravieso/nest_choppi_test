import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Un Guard personalizado que invoca la estrategia 'jwt' de Passport.
 *
 * Al aplicar este Guard (ej. @UseGuards(JwtAuthGuard)) a un endpoint,
 * NestJS ejecutará automáticamente la JwtStrategy para validar el
 * token JWT en el encabezado de la solicitud.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
