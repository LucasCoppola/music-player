import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import * as fs from 'node:fs';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
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

    try {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      const filePath = `${uploadPath}/${Date.now()}-${file.originalname}`;

      await fs.promises.writeFile(filePath, file.buffer);

      return {
        message: 'File uploaded successfully',
        path: filePath,
        mimetype: file.mimetype,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      };
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async create(
    createTrackDto: CreateTrackDto,
    user_id: string,
  ): Promise<Track> {
    const { title, artist, track_file_path, size, mimetype } = createTrackDto;

    try {
      const user = await this.usersService.findOneById(user_id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newTrack = await this.tracksRepository
        .createQueryBuilder()
        .insert()
        .into(Track)
        .values({ title, artist, user_id, track_file_path, size, mimetype })
        .returning('*')
        .execute();

      return newTrack.raw[0];
    } catch (error) {
      console.log('Error creating track: ', error);
      throw new InternalServerErrorException('Failed to create track');
    }
  }

  async findAll(user_id: string): Promise<Track[]> {
    try {
      const user = await this.usersService.findOneById(user_id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const tracks = await this.tracksRepository
        .createQueryBuilder('track')
        .where('track.user_id = :user_id', { user_id })
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

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const track = await this.tracksRepository
        .createQueryBuilder('track')
        .where('track.user_id = :user_id', { user_id })
        .where('track.id = :id', { id })
        .getOne();

      return track;
    } catch (error) {
      console.log('Error finding track: ', error);
      throw new InternalServerErrorException('Failed to find track');
    }
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
