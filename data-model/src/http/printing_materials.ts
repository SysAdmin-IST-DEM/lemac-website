import { z, ZodSchema } from "zod";
import {
  PrintMaterialCreateInputObjectZodSchema,
  PrintMaterialUpdateInputObjectZodSchema,
} from '../generated/zod-prisma/schemas/index.js';

// Add Print Material

export const AddPrintMaterialBody = PrintMaterialCreateInputObjectZodSchema;

export type AddPrintMaterialBody = z.infer<typeof AddPrintMaterialBody>;

// Edit Print Material

export const EditPrintMaterialBody = PrintMaterialCreateInputObjectZodSchema.partial();

export type EditPrintMaterialBody = z.infer<typeof EditPrintMaterialBody>;
