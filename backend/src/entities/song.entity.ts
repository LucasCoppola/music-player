import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Playlist } from './playlist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  duration: number;

  @Column()
  file_path: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Artist, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @ManyToOne(() => Album, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];
}
