import * as controller from './controller.js';
import * as entryController from '../entries/controller.js';
import type { RequestWithBody } from '../../middleware/parseBody.js';
import type { Request, Response } from 'express';
import { AddEntryBody, GetActiveEntryBody } from '@lemac/data-model';

export async function getActiveEntry(req: RequestWithBody<typeof GetActiveEntryBody>, res: Response) {
  const data = await controller.getActiveEntry(req.body.mifareNumber);
  res.json(data);
}

export async function addEntry(req: RequestWithBody<typeof AddEntryBody>, res: Response) {
  const data = await entryController.addEntry(req.body.istId, req.body.workstationId);
  res.json(data);
}

export async function closeEntry(req: Request, res: Response) {
  if(!req.params.id) {
    res.status(400);
    return;
  }
  const data = await entryController.closeEntry(Number(req.params.id));
  res.json(data);
}