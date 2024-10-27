import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as ffmpeg from 'fluent-ffmpeg';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from '../entities/track.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private usersService: UsersService,
    private fileService: FileService,
  ) {}

  async uploadTrack({
    file,
    user_id,
  }: {
    file: Express.Multer.File;
    user_id: string;
  }) {
    const uploadTracksPath = `./uploads/${user_id}/tracks`;
    const fileSizeInKb = Math.floor(file.size / 1024);
    const track_name = `${Date.now()}-${file.originalname}`;

    await this.fileService.writeFile({
      directory: uploadTracksPath,
      filename: track_name,
      buffer: file.buffer,
    });

    return {
      message: 'File uploaded successfully',
      track_name,
      size_in_kb: fileSizeInKb,
      mimetype: file.mimetype,
    };
  }

  async uploadImage({
    file,
    user_id,
  }: {
    file: Express.Multer.File;
    user_id: string;
  }) {
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const fileSizeInKb = Math.floor(file.size / 1024);
    const image_name = `${Date.now()}-${file.originalname}`;

    await this.fileService.writeFile({
      directory: uploadImagesPath,
      filename: image_name,
      buffer: file.buffer,
    });

    return {
      message: 'Track cover image uploaded successfully',
      image_name,
      size_in_kb: fileSizeInKb,
      mimetype: file.mimetype,
    };
  }

  async toggleFavorite({
    id,
    user_id,
    isFavorite,
  }: {
    id: string;
    user_id: string;
    isFavorite: boolean;
  }) {
    try {
      await this.tracksRepository
        .createQueryBuilder()
        .update()
        .set({ favorite: isFavorite })
        .where('id = :id', { id })
        .andWhere('user_id = :user_id', { user_id })
        .execute();
    } catch (error) {
      console.error(`Error toggling favorite status: `, error);
      throw new InternalServerErrorException(
        `Failed to ${isFavorite ? 'mark' : 'unmark'} track as favorite`,
      );
    }
  }

  async search({ query, user_id }: { query: string; user_id: string }) {
    try {
      const tracks = await this.tracksRepository
        .createQueryBuilder('track')
        .where('track.title ILIKE :query', { query: `%${query}%` })
        .orWhere('track.artist ILIKE :query', { query: `%${query}%` })
        .andWhere('track.user_id = :user_id', { user_id })
        .getMany();

      return tracks;
    } catch (error) {
      console.log('Error searching tracks: ', error);
      throw new InternalServerErrorException('Failed to search tracks');
    }
  }

  async create({
    createTrackDto,
    user_id,
  }: {
    createTrackDto: CreateTrackDto;
    user_id: string;
  }) {
    const {
      title,
      artist,
      track_name,
      audio_mimetype,
      audio_size_in_kb,
      image_name,
      image_mimetype,
      image_size_in_kb,
    } = createTrackDto;

    try {
      const [user, { duration, bit_rate }] = await Promise.all([
        this.usersService.findOneById(user_id),
        this.getAudioMetadata({ user_id, track_name }),
      ]);

      await this.tracksRepository
        .createQueryBuilder()
        .insert()
        .into(Track)
        .values({
          title,
          artist,
          user_id: user.id,
          track_name,
          audio_size_in_kb,
          audio_mimetype,
          duration,
          bit_rate,
          image_name: image_name ?? null,
          image_mimetype: image_mimetype ?? null,
          image_size_in_kb: image_size_in_kb ?? null,
        })
        .execute();

      return { message: 'Track created successfully' };
    } catch (error) {
      console.log('Error creating track: ', error);
      throw new InternalServerErrorException('Failed to create track');
    }
  }

  async findAll({ user_id }: { user_id: string }): Promise<Track[]> {
    const user = await this.usersService.findOneById(user_id);

    try {
      const tracks = await this.tracksRepository
        .createQueryBuilder('track')
        .where('track.user_id = :user_id', { user_id: user.id })
        .orderBy('track.created_at', 'DESC')
        .getMany();

      return tracks;
    } catch (error) {
      console.log('Error finding tracks: ', error);
      throw new InternalServerErrorException('Failed to find tracks');
    }
  }

  async findOne({
    id,
    user_id,
  }: {
    id: string;
    user_id: string;
  }): Promise<Track> {
    const user = await this.usersService.findOneById(user_id);

    try {
      const track = await this.tracksRepository
        .createQueryBuilder('track')
        .where('track.id = :id', { id })
        .andWhere('track.user_id = :user_id', { user_id: user.id })
        .getOne();

      if (!track) {
        throw new NotFoundException('Track not found');
      }

      return track;
    } catch (error) {
      console.log('Error finding track: ', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to find track');
      }
    }
  }

  async update({
    id,
    user_id,
    updateTrackDto,
  }: {
    id: string;
    user_id: string;
    updateTrackDto: UpdateTrackDto;
  }) {
    const { title, artist, image_name, mimetype, size_in_kb } = updateTrackDto;
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const track = await this.findOne({ id, user_id });
    const oldImageName = track.image_name;

    const updateFields: Partial<Track> = {};

    if (title) updateFields.title = title;
    if (artist) updateFields.artist = artist;
    if (image_name) {
      updateFields.image_name = image_name;
      updateFields.image_mimetype = mimetype;
      updateFields.image_size_in_kb = size_in_kb;
    }

    try {
      const result = await this.tracksRepository
        .createQueryBuilder()
        .update(Track)
        .set(updateFields)
        .where('id = :id', { id: track.id })
        .andWhere('user_id = :user_id', { user_id })
        .returning('id, image_name')
        .execute();

      if (oldImageName && oldImageName !== result.raw[0].image_name) {
        await this.fileService.removeFile({
          filePath: `${uploadImagesPath}/${oldImageName}`,
        });
      }

      return {
        message: 'Track updated successfully.',
        trackId: result.raw[0].id,
      };
    } catch (error) {
      console.log('Error updating track: ', error);
      throw new InternalServerErrorException('Failed to update track');
    }
  }

  async remove({ id, user_id }: { id: string; user_id: string }) {
    const uploadImagesPath = `./uploads/${user_id}/images`;
    const uploadTracksPath = `./uploads/${user_id}/tracks`;
    const [user, track] = await Promise.all([
      this.usersService.findOneById(user_id),
      this.findOne({ id, user_id }),
    ]);

    await this.fileService.removeFile({
      filePath: `${uploadTracksPath}/${track.track_name}`,
    });

    if (track.image_name) {
      await this.fileService.removeFile({
        filePath: `${uploadImagesPath}/${track.image_name}`,
      });
    }

    try {
      await this.tracksRepository
        .createQueryBuilder()
        .delete()
        .from(Track)
        .where('id = :id', { id })
        .andWhere('user_id = :user_id', { user_id: user.id })
        .execute();

      return {
        message: 'Track removed successfully',
      };
    } catch (error) {
      console.log('Error removing track: ', error);
      throw new InternalServerErrorException('Failed to remove track');
    }
  }

  async getAudioMetadata({
    user_id,
    track_name,
  }: {
    user_id: string;
    track_name: string;
  }): Promise<{ duration: number; bit_rate: number }> {
    const uploadTracksPath = `./uploads/${user_id}/tracks`;
    const track_file_path = `${uploadTracksPath}/${track_name}`;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(track_file_path, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            duration: metadata.format.duration,
            bit_rate: metadata.format.bit_rate,
          });
        }
      });
    });
  }
}
