import { Router } from 'express';
import { BranchService } from '../services/branch.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBranchSchema, updateBranchSchema, updateSettingsSchema } from '../schemas/branch.schema';
import { AuthRequest } from '../middleware/auth'; // AuthRequest'i içe aktarın

export const branchRouter = Router();
const branchService = new BranchService();

// Tüm route'larda kullanıcıyı doğrulama
branchRouter.use(authenticate);

// Branch oluşturma - hem 'admin' hem 'user' rolleri izinli
branchRouter.post(
  '/',
  authorize('admin', 'user'),
  validate(createBranchSchema),
  async (req: AuthRequest, res, next) => { // AuthRequest tipi kullanılıyor
    try {
      const branch = await branchService.create(req.body);
      res.status(201).json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      // userId mevcut değilse bir hata döndür
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const branches = await branchService.findAll(userId);
    res.json(branches);
  } catch (error) {
    next(error);
  }
});


// Belirli bir branch'i getirme
branchRouter.get('/:id', async (req: AuthRequest, res, next) => { // AuthRequest tipi kullanılıyor
  try {
    const branch = await branchService.findById(req.params.id);
    res.json(branch);
  } catch (error) {
    next(error);
  }
});

// Branch güncelleme - hem 'admin' hem 'user' rolleri izinli
branchRouter.patch(
  '/:id',
  authorize('admin', 'user'),
  validate(updateBranchSchema),
  async (req: AuthRequest, res, next) => { // AuthRequest tipi kullanılıyor
    try {
      const branch = await branchService.update(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      next(error);
    }
  }
);

// Branch silme - sadece 'admin' rolü izinli
branchRouter.delete('/:id', authorize('admin'), async (req: AuthRequest, res, next) => { // AuthRequest tipi kullanılıyor
  try {
    await branchService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Branch ayarlarını güncelleme - hem 'admin' hem 'user' rolleri izinli
branchRouter.patch(
  '/:id/settings',
  authorize('admin', 'user'),
  validate(updateSettingsSchema),
  async (req: AuthRequest, res, next) => { // AuthRequest tipi kullanılıyor
    try {
      const branch = await branchService.updateSettings(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      next(error);
    }
  }
);
