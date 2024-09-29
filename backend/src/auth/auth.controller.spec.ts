import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterArtistDto } from './dto/register-artist.dto';
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
            registerUser: jest.fn(),
            registerArtist: jest.fn(),
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
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'test123',
      role: 'user',
    };

    it('should call login with correct parameters and return a token', async () => {
      const loginResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResult);

      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(loginResult);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(authController.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('registerUser', () => {
    const registerUserDto: RegisterUserDto = {
      email: 'test@example.com',
      password: 'test123',
      username: 'testuser',
    };

    it('should call registerUser with correct parameters and return a token', async () => {
      const registerResult = { access_token: 'jwt-token' };

      jest.spyOn(authService, 'registerUser').mockResolvedValue(registerResult);

      const result = await authController.registerUser(registerUserDto);

      expect(authService.registerUser).toHaveBeenCalledWith(registerUserDto);
      expect(result).toEqual(registerResult);
    });

    it('should throw ConflictException when email is already in use', async () => {
      jest
        .spyOn(authService, 'registerUser')
        .mockRejectedValue(new ConflictException('Email is already in use'));

      await expect(
        authController.registerUser(registerUserDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('registerArtist', () => {
    const registerArtistDto: RegisterArtistDto = {
      email: 'artist@example.com',
      password: 'artist123',
      username: 'artistuser',
      bio: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    };

    it('should call registerArtist with correct parameters and return a token', async () => {
      const registerResult = { access_token: 'jwt-token' };

      jest
        .spyOn(authService, 'registerArtist')
        .mockResolvedValue(registerResult);

      const result = await authController.registerArtist(registerArtistDto);

      expect(authService.registerArtist).toHaveBeenCalledWith(
        registerArtistDto,
      );
      expect(result).toEqual(registerResult);
    });

    it('should throw ConflictException when email is already in use', async () => {
      jest
        .spyOn(authService, 'registerArtist')
        .mockRejectedValue(new ConflictException('Email is already in use'));

      await expect(
        authController.registerArtist(registerArtistDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile from the request', () => {
      const req = { user: { id: 1, username: 'testuser', role: 'user' } };

      const result = authController.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});
