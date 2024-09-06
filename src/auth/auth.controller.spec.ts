import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    const loginAuthDto: LoginAuthDto = {
      email: 'test@example.com',
      password: 'test123',
    };

    it('should call login with correct parameters and return a token', async () => {
      const loginResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authController.login(loginAuthDto);
      expect(authService.login).toHaveBeenCalledWith(loginAuthDto);
      expect(result).toEqual(loginResult);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(loginAuthDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const registerAuthDto: RegisterAuthDto = {
      email: 'test@example.com',
      password: 'test123',
      username: 'testuser',
    };

    it('should call register with correct parameters and return a token', async () => {
      const registerResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'register').mockResolvedValue(registerResult);

      const result = await authController.register(registerAuthDto);

      expect(authService.register).toHaveBeenCalledWith(registerAuthDto);
      expect(result).toEqual(registerResult);
    });

    it('should throw ConflictException when email is already in use', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new ConflictException('Email is already in use'));

      await expect(authController.register(registerAuthDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const req = { user: { id: 1, username: 'testuser' } };

      const result = authController.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});
