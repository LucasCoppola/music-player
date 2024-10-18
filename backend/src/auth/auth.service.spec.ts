import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PlaylistService } from '../playlist/playlist.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let playlistService: PlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: PlaylistService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    playlistService = module.get<PlaylistService>(PlaylistService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    const mockUser: User = {
      id: '83bff5e9-ec3f-498c-aa21-45d0d21a04e4',
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'hashedpassword',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return an access token when user credentials are valid', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user password is incorrect', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create a new user and return an access token', async () => {
      const mockNewUser: Omit<User, 'password'> = {
        id: '0c51eea2-8834-4b8f-ac8d-4ec13ba94131',
        username: 'newuser',
        email: 'new@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockNewUser);
      jest
        .spyOn(playlistService, 'create')
        .mockResolvedValue({ message: 'Playlist created successfully.' });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      const result = await authService.register(registerDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: 'hashedpassword',
        username: registerDto.username,
      });
      expect(playlistService.create).toHaveBeenCalledWith({
        id: expect.any(String),
        title: 'Favorites',
        owner_id: mockNewUser.id,
        image_name: 'heart.png',
        type: 'favorite',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockNewUser.id,
        username: mockNewUser.username,
        email: mockNewUser.email,
      });
    });

    it('should throw ConflictException when email is already in use', async () => {
      const existentUser: User = {
        id: 'f07dadf8-45a5-469a-af89-235f484b433e',
        username: 'unrelateduser',
        email: 'existing@example.com',
        password: 'hashedpassword',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue(existentUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
