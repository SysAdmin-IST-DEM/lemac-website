import { z } from 'zod';

export const GetActiveEntryBody = z.object({
  mifareNumber: z.string()
});

export const  AddEntryBody = z.object({
  istId: z.string(),
  workstationId: z.number()
});