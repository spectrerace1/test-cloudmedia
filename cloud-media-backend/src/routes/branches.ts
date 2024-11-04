<content>import { Router } from 'express';
import { BranchService } from '../services/branch.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBranchSchema, updateBranchSchema, updateSettingsSchema } from '../schemas/branch.schema';

export const branchRouter = Router();
const branchService = new BranchService();

branchRouter.use(authenticate);

branchRouter.post(
  '/',
  authorize('admin'),
  validate(createBranchSchema),
  async (req, res, next) => {
    try {
      const branch = await branchService.create(req.body);
      res.status(201).json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchRouter.get('/', async (req, res, next) => {
  try {
    const branches = await branchService.findAll();
    res.json(branches);
  } catch (error) {
    next(error);
  }
});

branchRouter.get('/:id', async (req, res, next) => {
  try {
    const branch = await branchService.findById(req.params.id);
    res.json(branch);
  } catch (error) {
    next(error);
  }
});

branchRouter.patch(
  '/:id',
  authorize('admin'),
  validate(updateBranchSchema),
  async (req, res, next) => {
    try {
      const branch = await branchService.update(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      next(error);
    }
  }
);

branchRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await branchService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

branchRouter.patch(
  '/:id/settings',
  authorize('admin'),
  validate(updateSettingsSchema),
  async (req, res, next) => {
    try {
      const branch = await branchService.updateSettings(req.params.id, req.body);
      res.json(branch);
    } catch (error) {
      next(error);
    }
  }
);
</content>