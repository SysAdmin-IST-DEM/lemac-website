import { z, ZodSchema } from "zod";
import {
  PrintTaskCreateInputObjectZodSchema,
} from '../generated/zod-prisma/schemas/index.js';

export const AddPrintTaskBody = PrintTaskCreateInputObjectZodSchema.omit({
  modelFile: true,
  status: true,
  price: true,
  createdAt: true,
  material: true
}).extend({
  materialId: z.coerce.number()
});

export type AddPrintTaskBody = z.infer<typeof AddPrintTaskBody>;