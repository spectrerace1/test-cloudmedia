import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Device } from './Device';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: {
    volume: number;
    operatingHours: {
      start: string;
      end: string;
    };
    timezone: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Device, device => device.branch)
  devices: Device[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}