import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Playlist } from './Playlist';
import { Branch } from './Branch';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Playlist)
  playlist: Playlist;

  @ManyToOne(() => Branch)
  branch: Branch;

  @Column({ type: 'jsonb' })
  schedule: {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    days: string[];
    repeat: boolean;
    interval: number;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}