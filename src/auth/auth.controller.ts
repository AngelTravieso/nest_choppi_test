import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { LoginRequestDto, LoginResponseDto, ProfileResponseDto } from './dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Maneja la solicitud de inicio de sesión del usuario.
   * Utiliza @UseGuards(LocalAuthGuard) para validar automáticamente las
   * credenciales (email/password) usando la LocalStrategy.
   * Si las credenciales son válidas, el Guard adjunta el objeto 'user' a la 'req'.
   *
   * @param req - La solicitud HTTP, que contiene el objeto 'user' validado
   *              (sin contraseña) adjuntado por LocalAuthGuard.
   * @param _loginDto - El DTO del cuerpo de la solicitud. Se usa para la
   *                   validación de Swagger y los pipes, pero LocalAuthGuard
   *                   es quien realmente procesa las credenciales.
   * @returns Un objeto { access_token: string } con el token JWT.
   */
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() _loginDto: LoginRequestDto) {
    return this.authService.login(req.user as Omit<User, 'password'>);
  }

  /**
   * Obtiene el perfil del usuario actualmente autenticado.
   * Esta ruta está protegida por @UseGuards(JwtAuthGuard), que valida
   * el token JWT presente en el encabezado 'Authorization'.
   * Si el token es válido, el Guard adjunta el payload del token (el usuario) a 'req.user'.
   *
   * @param req - La solicitud HTTP, que contiene el payload del usuario
   *              autenticado (extraído del JWT).
   * @returns El objeto de usuario (payload del token) tal como fue extraído por JwtAuthGuard.
   */

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado (Token inválido o expirado)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return req.user;
  }
}
