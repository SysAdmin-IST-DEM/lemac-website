import { z } from "zod";
import {
  PrintTaskUncheckedCreateInputObjectZodSchema,
} from '../generated/zod-prisma/schemas/index.js';

// Add Print Task

export const AddPrintTaskBody = PrintTaskUncheckedCreateInputObjectZodSchema.omit({
  id: true,
  modelFiles: true,
  status: true,
  createdAt: true,
  price: true,
  name: true,
}).extend({
  materialId: z.coerce.number(),
  price: z.coerce.number()
});

export type AddPrintTaskBody = z.infer<typeof AddPrintTaskBody>;

// Edit Print Task

export const EditPrintTaskBody = PrintTaskUncheckedCreateInputObjectZodSchema.partial().omit({
  id: true,
  modelFiles: true,
  createdAt: true,
});

export type EditPrintTaskBody = z.infer<typeof EditPrintTaskBody>;