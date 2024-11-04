import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';
import { TrackModule } from './track/track.module';
import configuration from '../config/configuration';
import { User } from './entities/user.entity';
import { Track } from './entities/track.entity';
import { Playlist } from './entities/playlist.entity';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${configuration().environment}`,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: configuration().database.url,
      entities: [User, Track, Playlist],
      synchronize: configuration().environment !== 'prod',
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    PlaylistModule,
    TrackModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
