import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AudioModule } from './audio/audio.module';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';
import configuration from '../config/configuration';

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
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: configuration().environment !== 'production',
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    AudioModule,
    SongModule,
    ArtistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
