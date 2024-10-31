import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TrackService } from '../track/track.service';
import { FileService } from '../file/file.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private usersService: UsersService,
    private trackService: TrackService,
    private fileService: FileService,
  ) {}

  async uploadImage({
    file,
    id,
    user_id,
  }: {
    file: Express.Multer.File;
    id: string;
    user_id: string;
  }) {
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const removeFileExt = file.originalname.split('.').slice(0, -1).join('.');
    const image_name = `${Date.now()}-${removeFileExt}`;

    const { result, filename } = await this.fileService.compressImage({
      image_name,
      outputDir: uploadImagesPath,
      buffer: file.buffer,
      size: 'medium',
    });

    const fileSizeInKb = Math.floor(file.size / 1024);

    await this.update({
      id,
      user_id,
      updatePlaylistDto: {
        image_name: filename,
        mimetype: result.format,
        size_in_kb: fileSizeInKb,
        title: null,
      },
    });

    return {
      message: 'Cover image uploaded successfully',
      playlistId: id,
    };
  }

  async create({
    user_id,
    createPlaylistDto,
  }: {
    user_id: string;
    createPlaylistDto: CreatePlaylistDto;
  }) {
    const { id, title, image_name, type } = createPlaylistDto;

    const user = await this.usersService.findOneById(user_id);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .insert()
        .into(Playlist)
        .values({
          id,
          title,
          user_id: user.id,
          image_name,
          type,
        })
        .execute();

      return { message: 'Playlist created successfully.' };
    } catch (error) {
      console.log('Error creating playlist: ', error);
      throw new InternalServerErrorException('Failed to create playlist');
    }
  }

  async findAll({ user_id }: { user_id: string }): Promise<Playlist[]> {
    const user = await this.usersService.findOneById(user_id);

    try {
      const playlists = await this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.user_id = :user_id', { user_id: user.id })
        .orderBy(
          `CASE WHEN playlist.type = 'favorite' THEN 0 ELSE 1 END`,
          'ASC',
        )
        .addOrderBy('playlist.created_at', 'DESC')
        .getMany();

      return playlists;
    } catch (error) {
      console.log('Error finding playlists: ', error);
      throw new InternalServerErrorException('Failed to find playlists');
    }
  }

  async findOne({
    user_id,
    id,
  }: {
    user_id: string;
    id: string;
  }): Promise<
    Playlist & { track_count: number; duration: number; user_id: string }
  > {
    const user = await this.usersService.findOneById(user_id);

    try {
      const playlist = await this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.id = :id', { id })
        .andWhere('playlist.user_id = :user_id', { user_id: user.id })
        .leftJoinAndSelect('playlist.tracks', 'tracks')
        .getOne();

      if (!playlist) {
        throw new NotFoundException('Playlist not found');
      }

      const track_count = playlist.tracks.length;
      const duration = playlist.tracks.reduce(
        (acc, track) => acc + track.duration,
        0,
      );

      return {
        ...playlist,
        track_count,
        duration,
      };
    } catch (error) {
      console.log('Error finding playlist: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to find playlist');
      }
    }
  }

  async findFavoritePlaylist(user_id: string) {
    try {
      const playlist = await this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.type = :type', { type: 'favorite' })
        .andWhere('playlist.user_id = :user_id', { user_id })
        .getOne();

      if (!playlist) {
        throw new NotFoundException('Favorite playlist not found');
      }

      return playlist;
    } catch (error) {
      console.log('Error finding favorite playlist: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to find favorite playlist',
        );
      }
    }
  }

  async update({
    id,
    user_id,
    updatePlaylistDto,
  }: {
    id: string;
    user_id: string;
    updatePlaylistDto: UpdatePlaylistDto;
  }) {
    const { title, image_name, mimetype, size_in_kb } = updatePlaylistDto;
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const playlist = await this.findOne({ user_id, id });

    try {
      const updateFields: Partial<Playlist> = {};
      let oldImageName: string | undefined;

      if (title && title !== playlist.title) updateFields.title = title;
      if (image_name) {
        oldImageName = playlist.image_name;

        updateFields.image_name = image_name;
        updateFields.mimetype = mimetype;
        updateFields.size_in_kb = size_in_kb;
      }

      const result = await this.playlistRepository
        .createQueryBuilder()
        .update(Playlist)
        .set(updateFields)
        .where('id = :id', { id: playlist.id })
        .andWhere('user_id = :user_id', { user_id })
        .returning('id, image_name')
        .execute();

      if (oldImageName && oldImageName !== result.raw[0].image_name) {
        await this.fileService.removeFile({
          filePath: `${uploadImagesPath}/${oldImageName}`,
        });
      }

      return {
        message: 'Playlist updated successfully.',
        playlistId: result.raw[0].id,
      };
    } catch (error) {
      console.log('Error updating playlist: ', error);
      throw new InternalServerErrorException('Failed to update playlist');
    }
  }

  async remove(id: string, user_id: string) {
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const [user, playlist] = await Promise.all([
      this.usersService.findOneById(user_id),
      this.findOne({ user_id, id }),
    ]);

    try {
      const result = await this.playlistRepository
        .createQueryBuilder()
        .delete()
        .from(Playlist)
        .where('id = :id', { id: playlist.id })
        .andWhere('user_id = :user_id', { user_id: user.id })
        .returning('id, image_name')
        .execute();

      if (result.raw[0].image_name) {
        await this.fileService.removeFile({
          filePath: `${uploadImagesPath}/${result.raw[0].image_name}`,
        });
      }

      return {
        playlistId: result.raw[0].id,
        message: 'Playlist removed successfully.',
      };
    } catch (error) {
      console.log('Error removing playlist: ', error);
      throw new InternalServerErrorException('Failed to remove playlist');
    }
  }

  async addTrack(id: string, user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findOne({ user_id, id }),
      this.trackService.findOne({ id: track_id, user_id }),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .add(track.id);

      return {
        message: 'Track added to playlist successfully',
        playlistId: playlist.id,
      };
    } catch (error) {
      console.log('Error adding track to playlist: ', error);
      throw new InternalServerErrorException('Failed to add track to playlist');
    }
  }

  async addTrackToFavorites(user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findFavoritePlaylist(user_id),
      this.trackService.findOne({ id: track_id, user_id }),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .add(track.id);

      await this.trackService.toggleFavorite({
        id: track_id,
        user_id,
        isFavorite: true,
      });

      return {
        message: 'Track added to Favorites',
        playlistId: playlist.id,
        trackId: track.id,
      };
    } catch (error) {
      console.log('Error adding track to favorites: ', error);
      throw new InternalServerErrorException(
        'Failed to add track to favorites',
      );
    }
  }

  async removeTrack(id: string, user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findOne({ user_id, id }),
      this.trackService.findOne({ id: track_id, user_id }),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .remove(track.id);

      return {
        message: 'Track removed from playlist successfully',
        playlistId: playlist.id,
      };
    } catch (error) {
      console.log('Error removing track from playlist: ', error);
      throw new InternalServerErrorException(
        'Failed to remove track from playlist',
      );
    }
  }

  async removeTrackFromFavorites(user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findFavoritePlaylist(user_id),
      this.trackService.findOne({ id: track_id, user_id }),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .remove(track.id);

      await this.trackService.toggleFavorite({
        id: track_id,
        user_id,
        isFavorite: false,
      });

      return {
        message: 'Track removed from Favorites',
        playlistId: playlist.id,
        trackId: track.id,
      };
    } catch (error) {
      console.log('Error removed track from favorites: ', error);
      throw new InternalServerErrorException(
        'Failed to removed track from favorites',
      );
    }
  }
}
