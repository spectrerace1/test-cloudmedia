import { AppDataSource } from '../data-source';
import { Schedule } from '../entities/Schedule';
import { Playlist } from '../entities/Playlist';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';

const scheduleRepository = AppDataSource.getRepository(Schedule);
const playlistRepository = AppDataSource.getRepository(Playlist);
const branchRepository = AppDataSource.getRepository(Branch);

export class ScheduleService {
  async create(scheduleData: {
    playlistId: string;
    branchId: string;
    schedule: Schedule['schedule'];
  }) {
    const playlist = await playlistRepository.findOne({
      where: { id: scheduleData.playlistId }
    });

    if (!playlist) {
      throw new AppError(404, 'Playlist not found');
    }

    const branch = await branchRepository.findOne({
      where: { id: scheduleData.branchId }
    });

    if (!branch) {
      throw new AppError(404, 'Branch not found');
    }

    // Validate schedule times
    const { startTime, endTime } = scheduleData.schedule;
    if (startTime >= endTime) {
      throw new AppError(400, 'End time must be after start time');
    }

    const schedule = scheduleRepository.create({
      playlist,
      branch,
      schedule: scheduleData.schedule
    });

    await scheduleRepository.save(schedule);

    // Add schedule to Redis for real-time processing
    await this.updateRedisSchedule(schedule);

    return schedule;
  }

  async findAll() {
    return scheduleRepository.find({
      relations: ['playlist', 'branch'],
      where: { isActive: true }
    });
  }

  async findById(id: string) {
    const schedule = await scheduleRepository.findOne({
      where: { id },
      relations: ['playlist', 'branch']
    });

    if (!schedule) {
      throw new AppError(404, 'Schedule not found');
    }

    return schedule;
  }

  async findByBranch(branchId: string) {
    return scheduleRepository.find({
      where: {
        branch: { id: branchId },
        isActive: true
      },
      relations: ['playlist']
    });
  }

  async update(id: string, scheduleData: Partial<Schedule['schedule']>) {
    const schedule = await this.findById(id);
    
    schedule.schedule = {
      ...schedule.schedule,
      ...scheduleData
    };

    await scheduleRepository.save(schedule);
    await this.updateRedisSchedule(schedule);

    return schedule;
  }

  async delete(id: string) {
    const schedule = await this.findById(id);
    schedule.isActive = false;
    await scheduleRepository.save(schedule);

    // Remove from Redis
    await redisClient.del(`schedule:${id}`);
  }

  private async updateRedisSchedule(schedule: Schedule) {
    const redisKey = `schedule:${schedule.id}`;
    
    await redisClient.hSet(redisKey, {
      playlistId: schedule.playlist.id,
      branchId: schedule.branch.id,
      schedule: JSON.stringify(schedule.schedule)
    });

    // Set expiry if schedule has end date
    if (schedule.schedule.endDate) {
      const endDate = new Date(schedule.schedule.endDate);
      const now = new Date();
      const ttl = Math.floor((endDate.getTime() - now.getTime()) / 1000);
      
      if (ttl > 0) {
        await redisClient.expire(redisKey, ttl);
      } else {
        await redisClient.del(redisKey);
      }
    }
  }

  async getActiveSchedules() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];

    return scheduleRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.playlist', 'playlist')
      .leftJoinAndSelect('schedule.branch', 'branch')
      .where('schedule.isActive = :isActive', { isActive: true })
      .andWhere('schedule.schedule.startDate <= :now', { now })
      .andWhere('(schedule.schedule.endDate IS NULL OR schedule.schedule.endDate >= :now)', { now })
      .andWhere('schedule.schedule.startTime <= :time', { time: currentTime })
      .andWhere('schedule.schedule.endTime >= :time', { time: currentTime })
      .andWhere(':day = ANY(schedule.schedule.days)', { day: currentDay })
      .getMany();
  }

  async processSchedules() {
    try {
      const activeSchedules = await this.getActiveSchedules();
      
      for (const schedule of activeSchedules) {
        try {
          await this.processSchedule(schedule);
        } catch (error) {
          logger.error(`Error processing schedule ${schedule.id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Error processing schedules:', error);
    }
  }

  private async processSchedule(schedule: Schedule) {
    const redisKey = `device:${schedule.branch.id}:playback`;
    const currentPlayback = await redisClient.hGetAll(redisKey);

    // Check if current playlist matches schedule
    if (currentPlayback.playlistId !== schedule.playlist.id) {
      // Publish playlist change event
      await redisClient.publish('playlist:change', JSON.stringify({
        branchId: schedule.branch.id,
        playlistId: schedule.playlist.id,
        scheduleId: schedule.id
      }));

      logger.info(`Schedule ${schedule.id} triggered playlist change for branch ${schedule.branch.id}`);
    }
  }

  // Start schedule processor
  async startScheduleProcessor() {
    // Process schedules every minute
    setInterval(() => this.processSchedules(), 60000);
    logger.info('Schedule processor started');
  }
}