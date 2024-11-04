import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => Branch, branch => branch.devices)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ name: 'branch_id' })
  branchId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}