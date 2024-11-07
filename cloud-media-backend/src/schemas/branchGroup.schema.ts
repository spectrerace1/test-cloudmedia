import { z } from 'zod';

export const createBranchGroupSchema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters'),
  description: z.string().optional(),
});

export const updateBranchGroupSchema = createBranchGroupSchema.partial();
