import * as controller from './controller.js';
import type { Request, Response } from 'express';
import type { RequestWithBody } from '../../middleware/parseBody.js';
import type { AddPrintTaskBody } from '@lemac/data-model';

export async function addPrintingTask(req: RequestWithBody<typeof AddPrintTaskBody>, res: Response) {
  if(!req.file) {
    return res.status(400).json({ error: 'Model file is required' });
  }

  const data = await controller.addPrintTask(
    req.body.name,
    req.file?.filename,
    req.body.amount ?? 1,
    req.body.istId,
    req.body.email,
    req.body.unit,
    req.body.materialId
  );

  console.log(data);

  return res.json(data);
}

export async function getPrintingTasks(req: Request, res: Response) {
  const body = req.body;
  if(!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

}