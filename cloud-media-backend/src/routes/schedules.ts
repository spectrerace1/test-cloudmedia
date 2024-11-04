import { Router } from 'express';
import { ScheduleService } from '../services/schedule.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedule.schema';

export const scheduleRouter = Router();
const scheduleService = new ScheduleService();

scheduleRouter.use(authenticate);

// Create new schedule
scheduleRouter.post(
  '/',
  authorize('admin'),
  validate(createScheduleSchema),
  async (req, res, next) => {
    try {
      const schedule = await scheduleService.create(req.body);
      res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

// Get all schedules
scheduleRouter.get('/', async (req, res, next) => {
  try {
    const schedules = await scheduleService.findAll();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// Get single schedule
scheduleRouter.get('/:id', async (req, res, next) => {
  try {
    const schedule = await scheduleService.findById(req.params.id);
    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// Get schedules by branch
scheduleRouter.get('/branch/:branchId', async (req, res, next) => {
  try {
    const schedules = await scheduleService.findByBranch(req.params.branchId);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// Update schedule
scheduleRouter.patch(
  '/:id',
  authorize('admin'),
  validate(updateScheduleSchema),
  async (req, res, next) => {
    try {
      const schedule = await scheduleService.update(req.params.id, req.body);
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

// Delete schedule
scheduleRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await scheduleService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get active schedules
scheduleRouter.get('/status/active', async (req, res, next) => {
  try {
    const schedules = await scheduleService.getActiveSchedules();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});