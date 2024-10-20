import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { JwtModule } from '@nestjs/jwt';
import { TrackModule } from '../track/track.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TrackModule,
    UsersModule,
    JwtModule,
    FileModule,
    TypeOrmModule.forFeature([Playlist]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {}
