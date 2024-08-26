import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: Partial<CreateUserDto>) {
    const { email, password, username } = createUserDto;

    try {
      const user = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ email, password, username })
        .returning('*')
        .execute();

      return user.raw as Omit<User, 'password'>;
    } catch (e) {
      throw new InternalServerErrorException('Error creating user', e.message);
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
