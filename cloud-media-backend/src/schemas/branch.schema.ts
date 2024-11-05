import { z } from 'zod';

const operatingHoursSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
});

const settingsSchema = z.object({
  volume: z.number().min(0).max(100),
  operatingHours: operatingHoursSchema,
  timezone: z.string()
});

export const createBranchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  settings: settingsSchema
});

export const updateBranchSchema = createBranchSchema.partial();

export const updateSettingsSchema = settingsSchema;