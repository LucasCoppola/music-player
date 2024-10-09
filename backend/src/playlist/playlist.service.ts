import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../entities/playlist.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private usersService: UsersService,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const { id, title, owner_id } = createPlaylistDto;

    const user = await this.usersService.findOneById(owner_id);

    try {
      const insertedPlaylist = await this.playlistRepository
        .createQueryBuilder()
        .insert()
        .into(Playlist)
        .values({
          id,
          title,
          owner_id: user.id,
        })
        .returning('*')
        .execute();

      return insertedPlaylist.raw[0];
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
        .orderBy('playlist.created_at', 'DESC')
        .getMany();

      return playlists;
    } catch (error) {
      console.log('Error finding playlists: ', error);
      throw new InternalServerErrorException('Failed to find playlists');
    }
  }

  async findOne(user_id: string, id: string): Promise<Playlist> {
    const user = await this.usersService.findOneById(user_id);

    try {
      const playlist = await this.playlistRepository
        .createQueryBuilder('playlist')
        .where('playlist.id = :id', { id })
        .andWhere('playlist.user_id = :user_id', { user_id: user.id })
        .getOne();

      return playlist;
    } catch (error) {
      console.log('Error finding playlist: ', error);
      throw new InternalServerErrorException('Failed to find playlist');
    }
  }

  update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: string) {
    return `This action removes a #${id} playlist`;
  }
}
