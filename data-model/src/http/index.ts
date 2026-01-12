export * from './printing_tasks.js'
export * from './printing_materials.js'

// Delete Value

import { z } from "zod";

export const DeleteValueBody = z.object({
  id: z.number().int().positive(),
});

export type DeleteValueBody = z.infer<typeof DeleteValueBody>;