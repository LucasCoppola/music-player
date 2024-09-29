import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Song } from './song.entity';
import { User } from './user.entity';

@Entity('song_play_count')
export class SongPlayCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  play_count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Song, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}
