import * as controller from './controller.js';
import * as entryController from '../entries/controller.js';
import type { RequestWithBody } from '../../middleware/parseBody.js';
import type { Request, Response } from 'express';
import { AddEntryBody, EntrySource, GetActiveEntryBody } from '@lemac/data-model';
import { emitCardScanned } from '../../services/cardAssignerSocket.js';
import { OnScanCardResultCode } from './controller.js';

export async function getActiveEntry(req: RequestWithBody<typeof GetActiveEntryBody>, res: Response) {
  if(emitCardScanned(req.body.mifareNumber)) {
    res.json({
      ok: true,
      code: OnScanCardResultCode.CARD_ASSIGNING,
    });
    return;
  }
  
  const data = await controller.getActiveEntry(req.body.mifareNumber);
  console.log("Active entry with mifareNumber: " + req.body.mifareNumber);
  res.json(data);
}

export async function addEntry(req: RequestWithBody<typeof AddEntryBody>, res: Response) {
  const data = await entryController.addEntry(req.body.istId, req.body.workstationId, EntrySource.CARD);
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