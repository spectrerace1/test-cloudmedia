import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from './entities/User';
import { Branch } from './entities/Branch';
import { Device } from './entities/Device';
import { Playlist } from './entities/Playlist';
import { Media } from './entities/Media';
import { Schedule } from './entities/Schedule';
import { BranchGroup } from './entities/BranchGroup'; // Yeni ekleme

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: false,
  logging: config.database.logging,
  entities: [User, Branch, Device, Playlist, Media, Schedule, BranchGroup], // BranchGroup eklendi
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  ssl: false,
  migrationsTableName: 'migrations',
  migrationsRun: false
});
