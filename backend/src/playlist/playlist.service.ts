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
import * as fs from 'fs';

@Injectable()
export class PlaylistService {
  private readonly uploadImagesPath = './uploads/images';

  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private usersService: UsersService,
    private trackService: TrackService,
  ) {}

  async uploadImage(file: Express.Multer.File, id: string, user_id: string) {
    const fileSizeInKb = Math.floor(file.size / 1024);

    try {
      if (!fs.existsSync(this.uploadImagesPath)) {
        fs.mkdirSync(this.uploadImagesPath, { recursive: true });
      }
      const image_name = `${Date.now()}-${file.originalname}`;
      const filePath = `${this.uploadImagesPath}/${image_name}`;

      await fs.promises.writeFile(filePath, file.buffer);

      await this.update(id, user_id, {
        image_name,
        mimetype: file.mimetype,
        size_in_kb: fileSizeInKb,
        title: null,
      });

      return {
        message: 'Cover image uploaded successfully',
        playlistId: id,
        image_file_path: filePath,
        mimetype: file.mimetype,
        size_in_kb: fileSizeInKb,
      };
    } catch (error) {
      console.error('Error uploading cover image: ', error);
      throw new InternalServerErrorException('Cover image upload failed');
    }
  }

  async create(createPlaylistDto: CreatePlaylistDto) {
    const { id, title, owner_id, image_name, type } = createPlaylistDto;

    const user = await this.usersService.findOneById(owner_id);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .insert()
        .into(Playlist)
        .values({
          id,
          title,
          owner_id: user.id,
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

  async findAll(user_id: string): Promise<Playlist[]> {
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

  async findOne(
    user_id: string,
    id: string,
  ): Promise<Playlist & { track_count: number; duration: number }> {
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

  async update(
    id: string,
    user_id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const { title, image_name, mimetype, size_in_kb } = updatePlaylistDto;
    const playlist = await this.findOne(user_id, id);

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
        await this.removeImageFile(oldImageName);
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
    const playlist = await this.findOne(user_id, id);

    try {
      const result = await this.playlistRepository
        .createQueryBuilder()
        .delete()
        .from(Playlist)
        .where('id = :id', { id: playlist.id })
        .andWhere('user_id = :user_id', { user_id })
        .returning('id, image_name')
        .execute();

      await this.removeImageFile(result.raw[0].image_name);

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
      this.findOne(user_id, id),
      this.trackService.findOne(track_id, user_id),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .add(track.id);

      return { message: 'Track added to playlist successfully' };
    } catch (error) {
      console.log('Error adding track to playlist: ', error);
      throw new InternalServerErrorException('Failed to add track to playlist');
    }
  }

  async addTrackToFavorites(user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findFavoritePlaylist(user_id),
      this.trackService.findOne(track_id, user_id),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .add(track.id);

      await this.trackService.toggleFavorite(track_id, user_id, true);

      return { message: 'Track added to Favorites' };
    } catch (error) {
      console.log('Error adding track to favorites: ', error);
      throw new InternalServerErrorException(
        'Failed to add track to favorites',
      );
    }
  }

  async removeTrack(id: string, user_id: string, track_id: string) {
    const [playlist, track] = await Promise.all([
      this.findOne(user_id, id),
      this.trackService.findOne(track_id, user_id),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .remove(track.id);

      return { message: 'Track removed from playlist successfully' };
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
      this.trackService.findOne(track_id, user_id),
    ]);

    try {
      await this.playlistRepository
        .createQueryBuilder()
        .relation(Playlist, 'tracks')
        .of(playlist.id)
        .remove(track.id);

      await this.trackService.toggleFavorite(track_id, user_id, false);

      return { message: 'Track removed from Favorites' };
    } catch (error) {
      console.log('Error removed track from favorites: ', error);
      throw new InternalServerErrorException(
        'Failed to removed track from favorites',
      );
    }
  }

  async removeImageFile(image_name: string) {
    const image_file_path = `${this.uploadImagesPath}/${image_name}`;

    try {
      await fs.promises.unlink(image_file_path);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('File not found:', image_file_path);
        return;
      } else {
        console.error('Error removing file:', error);
        throw new InternalServerErrorException('Failed to remove file');
      }
    }
  }
}
