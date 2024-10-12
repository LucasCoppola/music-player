import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as fs from 'node:fs';
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
      const filePath = `${uploadPath}/${Date.now()}-${file.originalname}`;

      await fs.promises.writeFile(filePath, file.buffer);

      return {
        message: 'File uploaded successfully',
        track_file_path: filePath,
        mimetype: file.mimetype,
        size_in_kb: fileSizeInKb,
      };
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async create(createTrackDto: CreateTrackDto, user_id: string) {
    const { title, artist, track_file_path, size_in_kb, mimetype } =
      createTrackDto;

    try {
      const user = await this.usersService.findOneById(user_id);

      await this.tracksRepository
        .createQueryBuilder()
        .insert()
        .into(Track)
        .values({
          title,
          artist,
          user_id: user.id,
          track_file_path,
          size_in_kb,
          mimetype,
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

      this.removeFile(track.track_file_path);

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

  async removeFile(track_file_path: string) {
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
}
