<content>import { z } from 'zod';

const settingsSchema = z.object({
  volume: z.number().min(0).max(100),
  operatingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }),
  timezone: z.string()
});

export const createBranchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  settings: settingsSchema.optional()
});

export const updateBranchSchema = createBranchSchema.partial();

export const updateSettingsSchema = settingsSchema;
</content>