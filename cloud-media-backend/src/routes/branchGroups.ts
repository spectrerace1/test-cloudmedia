import { Router } from 'express';
import { BranchGroupService } from '../services/branchGroup.service';
import { validate } from '../middleware/validate';
import { createBranchGroupSchema, updateBranchGroupSchema } from '../schemas/branchGroup.schema';
import { authenticate, authorize } from '../middleware/auth';

export const branchGroupRouter = Router();
const branchGroupService = new BranchGroupService();

// Tüm route'larda kullanıcıyı doğrulama
branchGroupRouter.use(authenticate);

// Grup oluşturma
branchGroupRouter.post(
  '/',
  authorize('admin', 'user'),
  validate(createBranchGroupSchema),
  async (req, res, next) => {
    try {
      const group = await branchGroupService.create(req.body);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  }
);

// Tüm grupları listeleme
branchGroupRouter.get('/', async (req, res, next) => {
  try {
    const groups = await branchGroupService.findAll();
    res.json(groups);
  } catch (error) {
    next(error);
  }
});

// Belirli bir grubu getirme
branchGroupRouter.get('/:id', async (req, res, next) => {
  try {
    const group = await branchGroupService.findById(req.params.id);
    res.json(group);
  } catch (error) {
    next(error);
  }
});

// Grup güncelleme
branchGroupRouter.patch(
  '/:id',
  authorize('admin', 'user'),
  validate(updateBranchGroupSchema),
  async (req, res, next) => {
    try {
      const group = await branchGroupService.update(req.params.id, req.body);
      res.json(group);
    } catch (error) {
      next(error);
    }
  }
);

// Grup silme
branchGroupRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await branchGroupService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Branch'i gruba ekleme
branchGroupRouter.post('/:groupId/branches/:branchId', authorize('admin', 'user'), async (req, res, next) => {
  try {
    const { groupId, branchId } = req.params;
    const branch = await branchGroupService.addBranchToGroup(branchId, groupId);
    res.json(branch);
  } catch (error) {
    next(error);
  }
});
