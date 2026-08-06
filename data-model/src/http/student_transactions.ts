import { StudentTransactionUncheckedCreateInputObjectZodSchema, } from '../generated/zod-prisma/schemas/index.js';

export const AddStudentTransactionBody = StudentTransactionUncheckedCreateInputObjectZodSchema.omit({
  id: true
});