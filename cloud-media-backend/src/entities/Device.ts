import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Branch } from './Branch';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'jsonb', nullable: true })
  status: {
    online: boolean;
    lastSeen: Date;
    ip: string;
    version: string;
    systemInfo: {
      os: string;
      memory: number;
      storage: number;
    };
  };

  @ManyToOne(() => Branch, branch => branch.devices)
  branch: Branch;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}