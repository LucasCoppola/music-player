import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ArtistService } from '../artist/artist.service';
import { RegisterArtistDto } from './dto/register-artist.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private artistsService: ArtistService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginDto) {
    const { email, password, role } = loginAuthDto;

    if (role === 'user') {
      return this.loginUser(email, password);
    } else if (role === 'artist') {
      return this.loginArtist(email, password);
    }
  }

  private async loginUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.username, role: 'user' };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }

  private async loginArtist(email: string, password: string) {
    const artist = await this.artistsService.findOneByEmail(email);
    if (!artist) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, artist.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: artist.id,
      username: artist.username,
      role: 'artist',
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;
    const [user, artist] = await Promise.all([
      this.usersService.findOneByEmail(email),
      this.artistsService.findOneByEmail(email),
    ]);

    if (user || artist) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
    });

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      role: 'user',
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }

  async registerArtist(registerArtistDto: RegisterArtistDto) {
    const { username, email, password, bio } = registerArtistDto;
    const [user, artist] = await Promise.all([
      this.usersService.findOneByEmail(email),
      this.artistsService.findOneByEmail(email),
    ]);

    if (user || artist) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newArtist = await this.artistsService.create({
      email,
      password: hashedPassword,
      username,
      bio,
    });

    const payload = {
      sub: newArtist.id,
      username: newArtist.username,
      role: 'artist',
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
    };
  }
}
