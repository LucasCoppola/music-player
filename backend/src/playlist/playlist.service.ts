import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/entities/playlist.entity';
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

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
  }

  async findAll(user_id: string): Promise<Playlist[]> {
    const user = this.usersService.findOneById(user_id);
    if (!user) throw new NotFoundException('User not found');

    const playlists = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.user_id = :user_id', { user_id })
      .orderBy('playlist.created_at', 'DESC')
      .getMany();

    return playlists;
  }

  async findOne(user_id: string, id: string): Promise<Playlist> {
    const user = this.usersService.findOneById(user_id);
    if (!user) throw new NotFoundException('User not found');

    const playlist = await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.id = :id', { id })
      .andWhere('playlist.user_id = :user_id', { user_id })
      .getOne();

    return playlist;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
