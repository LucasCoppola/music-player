import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

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

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginAuthDto: LoginAuthDto = {
        email: 'test@example.com',
        password: 'test123',
      };
      const loginResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authController.login(loginAuthDto);
      expect(authService.login).toHaveBeenCalledWith(loginAuthDto);
      expect(result).toEqual(loginResult);
    });
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const registerAuthDto: RegisterAuthDto = {
        email: 'test@example.com',
        password: 'test123',
        username: 'testuser',
      };
      const registerResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'register').mockResolvedValue(registerResult);

      const result = await authController.register(registerAuthDto);

      expect(authService.register).toHaveBeenCalledWith(registerAuthDto);
      expect(result).toEqual(registerResult);
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
