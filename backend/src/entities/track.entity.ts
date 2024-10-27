import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  title: string;

  @Column()
  artist: string;

  @Column()
  audio_mimetype: string;

  @Column()
  audio_size_in_kb: number;

  @Column({ nullable: true })
  image_mimetype: string;

  @Column({ nullable: true })
  image_size_in_kb: number;

  @Column({ type: 'float' })
  duration: number;

  @Column()
  bit_rate: number;

  @Column({ default: false })
  favorite: boolean;

  @Column()
  track_name: string;

  @Column({ nullable: true })
  image_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Playlist, (playlist) => playlist.tracks, {
    onDelete: 'CASCADE',
  })
  playlists: Playlist[];
}
