import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { PlaylistModule } from './playlist/playlist.module';
import { TrackModule } from './track/track.module';
import configuration from '../config/configuration';
import { User } from './entities/user.entity';
import { Track } from './entities/track.entity';
import { Playlist } from './entities/playlist.entity';
import { Favorites } from './entities/favorites.entity';
import { ListeningHistory } from './entities/listening_history.entity';
import { TrackPlayCount } from './entities/track_play_count.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${configuration().environment}`,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: configuration().database.host,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.name,
      entities: [
        User,
        Track,
        Playlist,
        Favorites,
        ListeningHistory,
        TrackPlayCount,
      ],
      synchronize: configuration().environment !== 'production',
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    AudioModule,
    PlaylistModule,
    TrackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
