import * as controller from './controller.js';
import type { RequestWithBody } from '../../middleware/parseBody.js';
import {
  type AddPrintMaterialBody,
  type EditPrintMaterialBody,
} from '@lemac/data-model';
import type { Request, Response } from 'express';

export async function addPrintingMaterial(req: RequestWithBody<typeof AddPrintMaterialBody>, res: Response) {
  const data = await controller.addPrintMaterial(
    req.body.name,
    req.body.description,
    req.body.priceMultiplier,
    req.body.active
  )

  res.status(201).json(data);
}

export async function getPrintingMaterials(req: Request, res: Response) {
  const data = await controller.getPrintMaterials();

  res.json(data);
}

export async function updatePrintingMaterial(req: RequestWithBody<typeof EditPrintMaterialBody>, res: Response) {
  const id = req.params.id;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  const data = await controller.editPrintMaterial(
    Number(id),
    req.body.name,
    req.body.description,
    req.body.priceMultiplier,
    req.body.active
  )

  res.json(data);
}

export async function deletePrintingMaterial(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  const data = await controller.deletePrintMaterial(
    Number(id)
  )

  res.json(data);
}