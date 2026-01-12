import { z } from "zod";
import {
  PrintTaskCreateInputObjectZodSchema,
} from '../generated/zod-prisma/schemas/index.js';

export const AddPrintTaskBody = PrintTaskCreateInputObjectZodSchema.omit({
  modelFiles: true,
  status: true,
  createdAt: true,
  material: true,
  price: true,
  name: true,
  assigned: true
}).extend({
  materialId: z.coerce.number(),
  price: z.coerce.number()
});

export type AddPrintTaskBody = z.infer<typeof AddPrintTaskBody>;

// Edit Print Material

export const EditPrintTaskBody = PrintTaskCreateInputObjectZodSchema.partial().omit({
  modelFiles: true,
  createdAt: true,
  material: true,
  assigned: true
}).extend({
  materialId: z.number().optional(),
  assignedId: z.number().nullable().optional()
});

export type EditPrintTaskBody = z.infer<typeof EditPrintTaskBody>;