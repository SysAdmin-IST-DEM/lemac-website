import { z } from 'zod';

export const GetActiveEntryBody = z.object({
  mifareNumber: z.coerce.bigint()
});

export const  AddEntryBody = z.object({
  istId: z.string(),
  workstationId: z.number()
});