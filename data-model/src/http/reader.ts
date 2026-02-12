import { z } from 'zod';

export const GetActiveEntryBody = z.object({
  mifareNumber: z.number()
});

export const  AddEntryBody = z.object({
  istId: z.string(),
  workstationId: z.number()
});