// services/branch.service.ts
import { AppDataSource } from '../data-source';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';

const branchRepository = AppDataSource.getRepository(Branch);

export class BranchService {
  async create(branchData: Partial<Branch & { userId: string }>) {
    console.log("Received branchData:", branchData); // branchData içindeki userId değerini kontrol edin
  
    if (!branchData.userId) {
      throw new AppError(400, 'User ID is required to create a branch');
    }
  
    const branch = branchRepository.create(branchData);
    await branchRepository.save(branch);
    return branch;
  }
  
  async findAll(userId: string) {
    return branchRepository.find({
      where: { isActive: true, userId }, // Kullanıcının kendi branch'lerini filtreleyin
      relations: ['devices']
    });
  }

  async findById(id: string) {
    const branch = await branchRepository.findOne({
      where: { id },
      relations: ['devices']
    });

    if (!branch) {
      throw new AppError(404, 'Branch not found');
    }

    return branch;
  }

  async update(id: string, branchData: Partial<Branch>) {
    const branch = await this.findById(id);
    branchRepository.merge(branch, branchData);
    return branchRepository.save(branch);
  }

  async delete(id: string) {
    const branch = await this.findById(id);
  
    if (!branch) {
      throw new AppError(404, 'Branch not found');
    }
  
    await branchRepository.remove(branch); // Branch’i veritabanından kalıcı olarak siler
  }
  

  async updateSettings(id: string, settings: Branch['settings']) {
    const branch = await this.findById(id);
    branch.settings = {
      ...branch.settings,
      ...settings
    };
    return branchRepository.save(branch);
  }
}
