import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    try {
      const user = await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({ email, password, username })
        .returning('*')
        .execute();

      return user.raw[0] as Omit<User, 'password'>;
    } catch (error) {
      console.log('Failed to create user: ', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.createQueryBuilder('user').getMany();
    } catch (error) {
      console.log('Error finding users: ', error);
      throw new InternalServerErrorException('Failed to find users');
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.log('Error finding user: ', error);
        throw new InternalServerErrorException('Failed to find user');
      }
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .getOne();

      return user;
    } catch (error) {
      console.log('Error finding user: ', error);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password, username } = updateUserDto;

    try {
      const updatedUser = await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({ email, password, username })
        .where('id = :id', { id })
        .execute();

      return updatedUser.raw[0];
    } catch (error) {
      console.log('Error updating user: ', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const userDeleted = await this.usersRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();

      return {
        message: 'User removed successfully',
        affected: userDeleted.affected,
      };
    } catch (error) {
      console.log('Error removing user: ', error);
      throw new InternalServerErrorException('Failed to remove user');
    }
  }
}
