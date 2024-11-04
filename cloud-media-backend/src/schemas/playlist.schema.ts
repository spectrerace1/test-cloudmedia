import { z } from 'zod';

const scheduleSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  days: z.array(z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']))
});

const settingsSchema = z.object({
  shuffle: z.boolean(),
  repeat: z.boolean(),
  volume: z.number().min(0).max(100),
  schedule: scheduleSchema
});

export const createPlaylistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  settings: settingsSchema.optional()
});

export const updatePlaylistSchema = createPlaylistSchema.partial();

export const mediaIdsSchema = z.object({
  mediaIds: z.array(z.string().uuid())
});

export const branchIdsSchema = z.object({
  branchIds: z.array(z.string().uuid())
});

export const updateSettingsSchema = settingsSchema;