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
  mimetype: string;

  @Column()
  size: number;

  @Column()
  track_file_path: string;

  @Column({ nullable: true })
  image_file_path: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToMany(() => Playlist, (playlist) => playlist.tracks)
  playlists: Playlist[];
}
