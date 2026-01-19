import { UserUncheckedCreateInputObjectZodSchema } from '../generated/zod-prisma/schemas/index.js';
import { z } from 'zod';

// Edit User

export const EditUserBody = UserUncheckedCreateInputObjectZodSchema.partial().omit({
  id: true,
});

export type EditUserBody = z.infer<typeof EditUserBody>;