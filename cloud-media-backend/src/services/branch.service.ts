<content>import { AppDataSource } from '../data-source';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';

const branchRepository = AppDataSource.getRepository(Branch);

export class BranchService {
  async create(branchData: Partial<Branch>) {
    const branch = branchRepository.create(branchData);
    await branchRepository.save(branch);
    return branch;
  }

  async findAll() {
    return branchRepository.find({
      relations: ['devices'],
      where: { isActive: true }
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
    branch.isActive = false;
    await branchRepository.save(branch);
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
</content>