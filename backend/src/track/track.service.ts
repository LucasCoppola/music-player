import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as fs from 'node:fs';
import * as ffmpeg from 'fluent-ffmpeg';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from '../entities/track.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private usersService: UsersService,
  ) {}

  async uploadTrack(file: Express.Multer.File) {
    const uploadPath = './uploads/tracks';
    const fileSizeInKb = Math.floor(file.size / 1024);

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      const track_name = `${Date.now()}-${file.originalname}`;
      const filePath = `${uploadPath}/${track_name}`;

      await fs.promises.writeFile(filePath, file.buffer);

      return {
        message: 'File uploaded successfully',
        track_name,
        mimetype: file.mimetype,
        size_in_kb: fileSizeInKb,
      };
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async uploadImage(file: Express.Multer.File, id: string, user_id: string) {
    const uploadPath = './uploads/images';
    const fileSizeInKb = Math.floor(file.size / 1024);

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      const image_name = `${Date.now()}-${file.originalname}`;
      const filePath = `${uploadPath}/${image_name}`;

      await fs.promises.writeFile(filePath, file.buffer);

      await this.update(id, user_id, {
        image_name,
        mimetype: file.mimetype,
        size_in_kb: fileSizeInKb,
      });

      return {
        message: 'Track cover image uploaded successfully',
        track_id: id,
        image_name,
      };
    } catch (error) {
      console.error('Error uploading track cover image: ', error);
      throw new InternalServerErrorException('Failed to upload cover image');
    }
  }

  async search(query: string, user_id: string) {
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

  async create(createTrackDto: CreateTrackDto, user_id: string) {
    const { title, artist, track_name, size_in_kb, mimetype } = createTrackDto;

    try {
      const [user, { duration, bit_rate }] = await Promise.all([
        this.usersService.findOneById(user_id),
        this.getAudioMetadata(track_name),
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
          size_in_kb,
          mimetype,
          duration,
          bit_rate,
        })
        .execute();

      return { message: 'Track created successfully' };
    } catch (error) {
      console.log('Error creating track: ', error);
      throw new InternalServerErrorException('Failed to create track');
    }
  }

  async findAll(user_id: string): Promise<Track[]> {
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

  async findOne(id: string, user_id: string): Promise<Track> {
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

  async update(id: string, user_id: string, updateTrackDto: UpdateTrackDto) {
    const { image_name, mimetype, size_in_kb } = updateTrackDto;
    const track = await this.findOne(id, user_id);
    const oldImageName = track.image_name;

    try {
      const result = await this.tracksRepository
        .createQueryBuilder()
        .update(Track)
        .set({
          image_name,
          mimetype,
          size_in_kb,
        })
        .where('id = :id', { id: track.id })
        .andWhere('user_id = :user_id', { user_id })
        .returning('image_name')
        .execute();

      if (oldImageName && oldImageName !== result.raw[0].image_name) {
        await this.removeFile(oldImageName, 'images');
      }

      return {
        message: 'Track updated successfully.',
      };
    } catch (error) {
      console.log('Error updating track: ', error);
      throw new InternalServerErrorException('Failed to update track');
    }
  }

  async remove(id: string, user_id: string) {
    try {
      const [user, track] = await Promise.all([
        this.usersService.findOneById(user_id),
        this.findOne(id, user_id),
      ]);

      this.removeFile(track.track_name, 'tracks');

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

  async removeFile(file_name: string, type: 'images' | 'tracks') {
    const file_path = `./uploads/${type}/${file_name}`;

    try {
      await fs.promises.unlink(file_path);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('File not found:', file_path);
        throw new NotFoundException();
      } else {
        console.error('Error removing file:', error);
        throw new InternalServerErrorException('Failed to remove file');
      }
    }
  }

  async getAudioMetadata(
    track_name: string,
  ): Promise<{ duration: number; bit_rate: number }> {
    const track_file_path = `./uploads/tracks/${track_name}`;
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
