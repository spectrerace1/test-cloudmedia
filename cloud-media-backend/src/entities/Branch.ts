import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Device } from './Device';
import { User } from './User';

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

  @ManyToOne(() => User, user => user.branches, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string; // userId'yi ayrı bir sütun olarak tanımlayın

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
