import { z } from 'zod';

export const AssignStudentCardBody = z.object({
  studentId: z.number().positive(),
  mifareNumber: z.coerce.bigint()
})

export type AssignStudentCardBody = z.infer<typeof AssignStudentCardBody>;