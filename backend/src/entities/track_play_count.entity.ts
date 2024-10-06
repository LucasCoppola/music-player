import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Track } from './track.entity';
import { User } from './user.entity';

@Entity('track_play_count')
export class TrackPlayCount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  play_count: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track: Track;
}
