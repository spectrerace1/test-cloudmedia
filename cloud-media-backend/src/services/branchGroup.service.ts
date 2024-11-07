import { AppDataSource } from '../data-source';
import { BranchGroup } from '../entities/BranchGroup';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';

const branchGroupRepository = AppDataSource.getRepository(BranchGroup);
const branchRepository = AppDataSource.getRepository(Branch);

export class BranchGroupService {
  async create(groupData: Partial<BranchGroup> & { branches: string[] }) {
    const { branches: branchIds, ...groupDetails } = groupData;

    // Yeni grubu oluştur
    const group = branchGroupRepository.create(groupDetails);
    await branchGroupRepository.save(group);

    // Branch'leri gruba ekle
    if (branchIds && branchIds.length > 0) {
      const branches = await branchRepository.findByIds(branchIds);

      if (branches.length !== branchIds.length) {
        throw new AppError(404, 'One or more branches not found');
      }

      // Her bir branch'i oluşturulan grupla ilişkilendir
      branches.forEach(branch => {
        branch.group = group;
      });

      await branchRepository.save(branches); // Tüm branch'leri aynı anda kaydet
    }

    // Grubu ilişkili branch'leri ile geri döndür
    return this.findById(group.id);
  }

  async findAll() {
    return branchGroupRepository.find({ relations: ['branches'] });
  }

  async findById(id: string) {
    const group = await branchGroupRepository.findOne({
      where: { id },
      relations: ['branches']
    });

    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    return group;
  }
  async update(id: string, groupData: Partial<BranchGroup>) {
    const group = await this.findById(id);

    // Mevcut branch'leri al
    const currentBranches = await branchRepository.find({
        where: { groupId: id },
    });

    // Yeni branch ID'lerini al
    const newBranchIds: string[] = groupData.branches?.map(branch => branch.id) || [];

    // Mevcut branch'lerden yeni gelen verilerde olmayanları güncelleyerek çıkartın
    const branchesToRemove = currentBranches.filter(branch => 
        !newBranchIds.includes(branch.id)
    );

    // Eşleşmeyen branch'lerin grup ID'sini null yap
    for (const branch of branchesToRemove) {
        branch.groupId = null; // Grubu null yaparak bağlantıyı kaldırın
        await branchRepository.save(branch); // Değişiklikleri kaydedin
    }

    // Gruplama bilgilerini güncelle
    branchGroupRepository.merge(group, groupData);
    return branchGroupRepository.save(group);
}




  async delete(id: string) {
    const group = await this.findById(id);
    if (!group) {
      throw new AppError(404, 'Group not found');
    }

    // Gruba bağlı branch'lerin `group` bağlantısını kaldır
    const branches = await branchRepository.find({ where: { group: { id } } });
    if (branches.length > 0) {
      branches.forEach(branch => {
        branch.group = null;
      });
      await branchRepository.save(branches); // Branch'leri kaydederek güncelle
    }

    // Grubu sil
    await branchGroupRepository.remove(group);
  }

  async addBranchToGroup(branchId: string, groupId: string) {
    const branch = await branchRepository.findOneBy({ id: branchId });
    const group = await this.findById(groupId);

    if (!branch) {
      throw new AppError(404, 'Branch not found');
    }

    branch.group = group;
    return branchRepository.save(branch);
  }
}
