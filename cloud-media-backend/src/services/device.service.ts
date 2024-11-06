import { AppDataSource } from '../data-source';
import { Device } from '../entities/Device';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';
import { redisClient } from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

const deviceRepository = AppDataSource.getRepository(Device);
const branchRepository = AppDataSource.getRepository(Branch);

export class DeviceService {
  async register(branchId: string, deviceData: Partial<Device>) {
    const branch = await branchRepository.findOne({
      where: { id: branchId }
    });

    if (!branch) {
      throw new AppError(404, 'Branch not found');
    }

    // Generate unique token for device
    const token = uuidv4();

    const device = deviceRepository.create({
      ...deviceData,
      token,
      branch,
      status: {
        online: false,
        lastSeen: new Date(),
        ip: '',
        version: deviceData.status?.version || '1.0.0',
        systemInfo: deviceData.status?.systemInfo || {
          os: '',
          memory: 0,
          storage: 0
        }
      }
    });

    await deviceRepository.save(device);
    return device;
  }

  async findAll() {
    const devices = await deviceRepository.find({
      relations: ['branch'],
      where: { isActive: true }
    });

    // Get real-time status from Redis
    const devicesWithStatus = await Promise.all(
      devices.map(async (device) => {
        const status = await redisClient.hGetAll(`device:${device.id}`);
        return {
          ...device,
          status: {
            ...device.status,
            ...status,
            online: status.status === 'online'
          }
        };
      })
    );

    return devicesWithStatus;
  }

  async findById(id: string) {
    const device = await deviceRepository.findOne({
      where: { id },
      relations: ['branch']
    });

    if (!device) {
      throw new AppError(404, 'Device not found');
    }

    // Get real-time status from Redis
    const status = await redisClient.hGetAll(`device:${device.id}`);
    return {
      ...device,
      status: {
        ...device.status,
        ...status,
        online: status.status === 'online'
      }
    };
  }

  async update(id: string, deviceData: Partial<Device>) {
    const device = await this.findById(id);
    deviceRepository.merge(device, deviceData);
    return deviceRepository.save(device);
  }

  async delete(id: string) {
    // Öncelikle cihazın varlığını kontrol ediyoruz, eğer bulunmazsa hata döndürülür
    const device = await this.findById(id);
  
    // Veritabanından tamamen silme işlemi
    await deviceRepository.remove(device);
  
    // Redis'ten cihazla ilgili tüm anahtarları kaldırma
    await redisClient.del(`device:${id}`);
    await redisClient.del(`device:${id}:playback`);
  }
  

  async updateStatus(id: string, status: Partial<Device['status']>) {
    const device = await this.findById(id);
    device.status = {
      ...device.status,
      ...status,
      lastSeen: new Date()
    };
    return deviceRepository.save(device);
  }

  async getPlaybackStatus(id: string) {
    const device = await this.findById(id);
    const playbackStatus = await redisClient.hGetAll(`device:${device.id}:playback`);
    return playbackStatus;
  }
}