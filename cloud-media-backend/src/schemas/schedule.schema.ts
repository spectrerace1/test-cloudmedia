import { z } from 'zod';

const scheduleSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  days: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])),
  repeat: z.boolean(),
  interval: z.number().min(1)
});

export const createScheduleSchema = z.object({
  playlistId: z.string().uuid(),
  branchId: z.string().uuid(),
  schedule: scheduleSchema
});

export const updateScheduleSchema = scheduleSchema.partial();