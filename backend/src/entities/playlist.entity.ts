import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  artist: User;

  @ManyToMany(() => Song, (song) => song.playlists)
  @JoinTable({
    name: 'playlist_songs',
    joinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'song_id',
      referencedColumnName: 'id',
    },
  })
  songs: Song[];
}
