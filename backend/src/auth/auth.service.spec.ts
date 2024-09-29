import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Artist } from '../entities/artist.entity';
import { LoginDto } from './dto/login.dto';
import { ArtistService } from '../artist/artist.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let artistsService: ArtistService;
  let jwtService: JwtService;

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
          provide: ArtistService,
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    artistsService = module.get<ArtistService>(ArtistService);
    jwtService = module.get<JwtService>(JwtService);
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
      role: 'user',
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
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockUser.id, username: mockUser.username, role: 'user' },
        { expiresIn: '1h' },
      );
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

    const mockArtist: Artist = {
      id: '83bff5e9-ec3f-498c-aa21-45d0d21a04e4',
      username: 'testartist',
      email: 'testartist@gmail.com',
      password: 'hashedpassword',
      bio: 'Test artist bio',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const artistLoginDto: LoginDto = {
      email: 'testartist@gmail.com',
      password: 'password123',
      role: 'artist',
    };

    it('should return an access token when artist credentials are valid', async () => {
      jest
        .spyOn(artistsService, 'findOneByEmail')
        .mockResolvedValue(mockArtist);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      const result = await authService.login(artistLoginDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(artistsService.findOneByEmail).toHaveBeenCalledWith(
        artistLoginDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        artistLoginDto.password,
        mockArtist.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockArtist.id, username: mockArtist.username, role: 'artist' },
        { expiresIn: '1h' },
      );
    });
  });

  describe('registerUser', () => {
    const registerUserDto = {
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
      jest.spyOn(artistsService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockNewUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      const result = await authService.registerUser(registerUserDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
      expect(artistsService.findOneByEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerUserDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        email: registerUserDto.email,
        password: 'hashedpassword',
        username: registerUserDto.username,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockNewUser.id, username: mockNewUser.username, role: 'user' },
        { expiresIn: '1h' },
      );
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
      jest.spyOn(artistsService, 'findOneByEmail').mockResolvedValue(null);

      await expect(authService.registerUser(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('registerArtist', () => {
    const registerArtistDto = {
      username: 'newartist',
      email: 'newartist@example.com',
      password: 'password123',
      bio: 'New artist bio',
    };

    it('should create a new artist and return an access token', async () => {
      const mockNewArtist: Omit<Artist, 'password'> = {
        id: '0c51eea2-8834-4b8f-ac8d-4ec13ba94131',
        username: 'newartist',
        email: 'newartist@example.com',
        bio: 'New artist bio',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(artistsService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);
      jest.spyOn(artistsService, 'create').mockResolvedValue(mockNewArtist);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mocked_token');

      const result = await authService.registerArtist(registerArtistDto);

      expect(result).toEqual({ access_token: 'mocked_token' });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(
        registerArtistDto.email,
      );
      expect(artistsService.findOneByEmail).toHaveBeenCalledWith(
        registerArtistDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerArtistDto.password, 10);
      expect(artistsService.create).toHaveBeenCalledWith({
        email: registerArtistDto.email,
        password: 'hashedpassword',
        username: registerArtistDto.username,
        bio: registerArtistDto.bio,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockNewArtist.id,
          username: mockNewArtist.username,
          role: 'artist',
        },
        { expiresIn: '1h' },
      );
    });

    it('should throw ConflictException when email is already in use', async () => {
      const existentArtist: Artist = {
        id: 'f07dadf8-45a5-469a-af89-235f484b433e',
        username: 'unrelatedartist',
        email: 'existing@example.com',
        password: 'hashedpassword',
        bio: 'Existent artist bio',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);
      jest
        .spyOn(artistsService, 'findOneByEmail')
        .mockResolvedValue(existentArtist);

      await expect(
        authService.registerArtist(registerArtistDto),
      ).rejects.toThrow(ConflictException);
    });
  });
});
