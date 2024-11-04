import { Router } from 'express';
import { DeviceService } from '../services/device.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerDeviceSchema, updateDeviceSchema, updateStatusSchema } from '../schemas/device.schema';

export const deviceRouter = Router();
const deviceService = new DeviceService();

deviceRouter.use(authenticate);

deviceRouter.post(
  '/register/:branchId',
  authorize('admin'),
  validate(registerDeviceSchema),
  async (req, res, next) => {
    try {
      const device = await deviceService.register(req.params.branchId, req.body);
      res.status(201).json(device);
    } catch (error) {
      next(error);
    }
  }
);

deviceRouter.get('/', async (req, res, next) => {
  try {
    const devices = await deviceService.findAll();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

deviceRouter.get('/:id', async (req, res, next) => {
  try {
    const device = await deviceService.findById(req.params.id);
    res.json(device);
  } catch (error) {
    next(error);
  }
});

deviceRouter.patch(
  '/:id',
  authorize('admin'),
  validate(updateDeviceSchema),
  async (req, res, next) => {
    try {
      const device = await deviceService.update(req.params.id, req.body);
      res.json(device);
    } catch (error) {
      next(error);
    }
  }
);

deviceRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await deviceService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

deviceRouter.patch(
  '/:id/status',
  validate(updateStatusSchema),
  async (req, res, next) => {
    try {
      const device = await deviceService.updateStatus(req.params.id, req.body);
      res.json(device);
    } catch (error) {
      next(error);
    }
  }
);

deviceRouter.get('/:id/playback', async (req, res, next) => {
  try {
    const status = await deviceService.getPlaybackStatus(req.params.id);
    res.json(status);
  } catch (error) {
    next(error);
  }
});