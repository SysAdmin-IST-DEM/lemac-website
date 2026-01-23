import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function addWorkstation(req: Request, res: Response) {
  //if the request body has proper structure inserts it db
  if (
    req.body &&
    req.body.name &&
    !!req.body.capacity &&
    req.body.type
  ) {
    const data = await controller.addWorkstation(req.body);
    if (data === 'ER_DUP_ENTRY') {
      res.status(409).send('duplicate entry');
      return;
    }
    const response = {
      ...data,
      softwares: JSON.parse(data.softwares) ?? [],
      problems: JSON.parse(data.problems) ?? [],
    };

    res.json(response);
    return;
  }
  res.sendStatus(400);
}

export async function getWorkstations(req: Request, res: Response) {
  const data = await controller.getWorkstations();
  if (data.length === 0) {
    //no users in db
    res.json([]);
    return;
  } else if (data.length > 0) {
    const response = data.map((x) => ({
      ...x,
      softwares: JSON.parse(x.softwares) ?? [],
      problems: JSON.parse(x.problems) ?? [],
    }));
    res.json(response);
    return;
  } else {
    //bad request
    res.sendStatus(400);
  }
}

export async function updateWorkstation(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (
    req.body &&
    req.body.name &&
    req.body.type &&
    req.body.softwares &&
    req.body.problems
  ) {
    console.log(req.body);
    const data = await controller.updateWorkstation(id, req.body);
    //no data found to update
    if (!data) {
      res.sendStatus(404);
      return;
    }
    const response = {
      ...data,
      softwares: JSON.parse(data.softwares) ?? [],
      problems: JSON.parse(data.problems) ?? [],
    };

    res.json(response);
    return;
  }
  res.sendStatus(400);
}

export async function deleteWorkstation(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteWorkstation(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}