import { z, ZodSchema } from "zod";
import {
  PrintMaterialUncheckedCreateInputObjectZodSchema,
} from '../generated/zod-prisma/schemas/index.js';

// Add Print Material

export const AddPrintMaterialBody = PrintMaterialUncheckedCreateInputObjectZodSchema.omit({
  id: true
});

export type AddPrintMaterialBody = z.infer<typeof AddPrintMaterialBody>;

// Edit Print Material

export const EditPrintMaterialBody = PrintMaterialUncheckedCreateInputObjectZodSchema.omit({
  id: true
}).partial();

export type EditPrintMaterialBody = z.infer<typeof EditPrintMaterialBody>;
