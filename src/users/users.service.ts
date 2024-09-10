import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<CreateUserDto>) {
    const { email, password, username } = createUserDto;

    const user = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ email, password, username })
      .returning('*')
      .execute();

    return user.raw[0] as Omit<User, 'password'>;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.createQueryBuilder('user').getMany();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const { email, password, username } = updateUserDto;
    return await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ email, password, username })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
  }
}
