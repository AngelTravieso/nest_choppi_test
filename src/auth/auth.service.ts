import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    /**
     * Valida si un usuario existe y el password es correcta
     */
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isMath = await bcrypt.compare(password, user.password);

        if (user && isMath) {
            const { password, ...result } = user;
            return result;
        }

        throw new UnauthorizedException('Credenciales incorrectas');

    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId }; // 'sub' (subject) es el ID del usuario
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
