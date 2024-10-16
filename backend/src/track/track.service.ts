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

  async uploadFile(file: Express.Multer.File) {
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
    try {
      const user = await this.usersService.findOneById(user_id);

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
    try {
      const user = await this.usersService.findOneById(user_id);

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

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  async remove(id: string, user_id: string) {
    try {
      const [user, track] = await Promise.all([
        this.usersService.findOneById(user_id),
        this.findOne(id, user_id),
      ]);

      this.removeFile(track.track_name);

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

  async removeFile(track_name: string) {
    const track_file_path = `./uploads/tracks/${track_name}`;
    try {
      await fs.promises.unlink(track_file_path);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('File not found:', track_file_path);
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
