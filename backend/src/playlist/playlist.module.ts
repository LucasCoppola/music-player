import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule, TypeOrmModule.forFeature([Playlist])],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
