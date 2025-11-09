import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockUserService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let mockedBcrypt: jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockedBcrypt.compare.mockClear();
    mockUserService.findOne.mockClear();
    mockJwtService.sign.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Pruebas para el método login()
  describe('login', () => {
    it('debería generar y retornar un token de acceso', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'jwt.token.string';
      const expectedPayload = { email: mockUser.email, sub: mockUser.id };

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser as any);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });

  // Pruebas para el método validateUser()
  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    // Mock user DB
    const mockUserFromDb = {
      id: 1,
      email: email,
      password: 'hashedPassword123',
      hashPassword: jest.fn(),
      stores: [],
      createdProducts: [],
    } as User;

    it('debería retornar el usuario (sin password) si la validación es exitosa', async () => {
      mockUserService.findOne.mockResolvedValue(mockUserFromDb);
      mockedBcrypt.compare.mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser(email, password);

      const { password: _, hashPassword: __, ...expectedUser } = mockUserFromDb;

      expect(result).toEqual(expectedUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        'hashedPassword123',
      );
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      mockUserService.findOne.mockResolvedValue(mockUserFromDb);
      mockedBcrypt.compare.mockImplementation(() => Promise.resolve(false));

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockUserService.findOne).toHaveBeenCalledWith(email);
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        password,
        'hashedPassword123',
      );
    });
  });
});
