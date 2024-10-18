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
import { Track } from './track.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ enum: ['regular', 'favorite'] })
  type: string;

  @Column({ nullable: true })
  image_name: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  size_in_kb: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  owner_id: string;

  @ManyToMany(() => Track, (track) => track.playlists, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'playlist_tracks',
    joinColumn: {
      name: 'playlist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'track_id',
      referencedColumnName: 'id',
    },
  })
  tracks: Track[];
}
