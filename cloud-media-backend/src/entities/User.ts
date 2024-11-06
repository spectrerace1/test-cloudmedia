import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { Branch } from './Branch'; // Branch entity'sini içe aktarın

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column({ default: 'user' })
  role: 'admin' | 'user';

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Branch, branch => branch.user)
  branches: Branch[]; // Kullanıcının sahip olduğu branch'ler

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
