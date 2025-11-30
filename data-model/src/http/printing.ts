import { z, ZodSchema } from "zod";
import { Unit } from '../generated/prisma/enums';
import {
  PrintTaskCreateInputObjectSchema,
  PrintTaskCreateInputObjectZodSchema,
  PrintTaskCreateOneZodSchema,
} from '../generated/zod-prisma/schemas';

export const AddPrintTaskBody = PrintTaskCreateInputObjectZodSchema.omit({
  modelFile: true,
  status: true,
  price: true,
  createdAt: true,
  material: true
}).extend({
  materialId: z.number()
});