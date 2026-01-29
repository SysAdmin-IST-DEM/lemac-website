export * from './printing_tasks.js'
export * from './printing_materials.js'
export * from './users.js'
export * from './reader.js'

// Delete Value

import { z } from "zod";

export const DeleteValueBody = z.object({
  id: z.number().int().positive(),
});

export type DeleteValueBody = z.infer<typeof DeleteValueBody>;