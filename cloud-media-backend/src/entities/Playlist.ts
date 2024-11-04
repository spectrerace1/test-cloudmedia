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
  @JoinTable()
  media: Media[];

  @ManyToMany(() => Branch)
  @JoinTable()
  branches: Branch[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}