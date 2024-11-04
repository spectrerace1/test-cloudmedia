import { z } from 'zod';

const systemInfoSchema = z.object({
  os: z.string(),
  memory: z.number(),
  storage: z.number()
});

const statusSchema = z.object({
  online: z.boolean().optional(),
  lastSeen: z.date().optional(),
  ip: z.string().optional(),
  version: z.string(),
  systemInfo: systemInfoSchema
});

export const registerDeviceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  status: statusSchema.optional()
});

export const updateDeviceSchema = registerDeviceSchema.partial();

export const updateStatusSchema = statusSchema;