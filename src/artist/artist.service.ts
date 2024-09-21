import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistsRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const { email, password, username, bio } = createArtistDto;

    const artist = await this.artistsRepository
      .createQueryBuilder()
      .insert()
      .into(Artist)
      .values({ email, password, username, bio })
      .returning('*')
      .execute();

    return artist.raw[0] as Omit<Artist, 'password'>;
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistsRepository.createQueryBuilder('artist').getMany();
  }

  async findOneById(id: string): Promise<Artist | null> {
    return await this.artistsRepository
      .createQueryBuilder('artist')
      .where('artist.id = :id', { id })
      .getOne();
  }

  async findOneByEmail(email: string): Promise<Artist | null> {
    return await this.artistsRepository
      .createQueryBuilder('artist')
      .where('artist.email = :email', { email })
      .getOne();
  }

  async update(
    id: number,
    updateArtistDto: UpdateArtistDto,
  ): Promise<UpdateResult> {
    const { email, password, username } = updateArtistDto;
    return await this.artistsRepository
      .createQueryBuilder()
      .update(Artist)
      .set({ email, password, username })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.artistsRepository
      .createQueryBuilder()
      .delete()
      .from(Artist)
      .where('id = :id', { id })
      .execute();
  }
}
