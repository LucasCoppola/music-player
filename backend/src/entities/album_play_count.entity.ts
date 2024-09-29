import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { User } from './user.entity';

@Entity('album_play_count')
export class AlbumPlayCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  play_count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Album, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  song: Album;
}
