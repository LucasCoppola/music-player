import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PlaylistService } from '../playlist/playlist.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private playlistService: PlaylistService,
  ) {}

  async login(loginAuthDto: LoginDto) {
    const { email, password } = loginAuthDto;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
    });

    const favoritePlaylistId = crypto.randomUUID();
    await this.playlistService.create({
      id: favoritePlaylistId,
      title: 'Favorites',
      owner_id: newUser.id,
      image_name: 'heart.png',
      type: 'favorite',
    });

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
