import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

type ValidatedUserPayload = Omit<User, 'password' | 'hashPassword'>;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales de un usuario comparando el email y la contraseña.
   * Este método es utilizado internamente por la LocalStrategy de Passport.
   *
   * @param email - El email del usuario que intenta iniciar sesión.
   * @param password - La contraseña en texto plano proporcionada por el usuario.
   * @returns El objeto de usuario (sin la contraseña) si la validación es exitosa.
   * @throws {UnauthorizedException} Si el email no existe o la contraseña es incorrecta.
   */

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUserPayload> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }

  /**
   * Genera un token de acceso JWT para un usuario ya validado.
   *
   * @param user - El objeto de usuario (sin contraseña) que ha sido autenticado.
   * @returns Un objeto que contiene el token de acceso: { access_token: string }.
   */

  async login(user: Omit<User, 'password'>) {
    // El payload del JWT contendrá el email y el ID de usuario (sub = subject)
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
