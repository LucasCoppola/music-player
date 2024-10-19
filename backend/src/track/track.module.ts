import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../entities/track.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    FileModule,
    TypeOrmModule.forFeature([Track]),
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
