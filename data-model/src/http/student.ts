import { z } from 'zod';

export const AssignStudentCardBody = z.object({
  id: z.number().positive()
})

export type AssignStudentCardBody = z.infer<typeof AssignStudentCardBody>;