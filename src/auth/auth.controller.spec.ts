import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto';
import { Test, TestingModule } from '@nestjs/testing';

const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    mockAuthService.login.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Pruebas para el endpoint login()
  describe('login', () => {
    it('debería llamar a authService.login con el usuario del request y retornar el token', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockRequest = { user: mockUser };
      const mockToken = { access_token: 'jwt.token.string' };

      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockRequest, {} as LoginRequestDto);

      expect(result).toEqual(mockToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  // Pruebas para el endpoint getMe()
  describe('getMe', () => {
    it('debería retornar el objeto user adjuntado al request (por el JwtAuthGuard)', () => {
      const mockUserPayload = { userId: 1, email: 'test@example.com' };
      const mockRequest = { user: mockUserPayload };
      const result = controller.getMe(mockRequest);

      expect(result).toEqual(mockUserPayload);

      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});
