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

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Device, device => device.branch)
  devices: Device[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}