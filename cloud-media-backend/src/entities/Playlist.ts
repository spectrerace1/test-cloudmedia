import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Media } from './Media';
import { Branch } from './Branch';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  settings: {
    shuffle: boolean;
    repeat: boolean;
    volume: number;
    schedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      days: string[];
    };
  };

  @ManyToMany(() => Media)
  @JoinTable({
    name: 'playlist_media',
    joinColumn: { name: 'playlist_id' },
    inverseJoinColumn: { name: 'media_id' }
  })
  media: Media[];

  @ManyToMany(() => Branch)
  @JoinTable({
    name: 'playlist_branches',
    joinColumn: { name: 'playlist_id' },
    inverseJoinColumn: { name: 'branch_id' }
  })
  branches: Branch[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}