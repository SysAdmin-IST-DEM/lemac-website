import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function addPublication(req: Request, res: Response) {
  const active = req.query.active == '1';
  if (req.body && req.body.title && req.body.text) {
    const data = await controller.addPublication(req.body.title, req.body.text, active);

    res.json(data);
    return;
  } else {
    res.sendStatus(400);
    return;
  }
}

export async function getPublications(req: Request, res: Response) {
  const active = req.query.active == '1';
  const data = await controller.getPublications(active);
  if (data.length === 0) {
    res.json([]);
    return;
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function updatePublications(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (req.body && req.body.text && req.body.title) {
    const data = await controller.updatePublication(id, req.body);
    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function deletePublication(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (await controller.deletePublication(id)) {
    res.sendStatus(204); // no content - success
    return;
  } else {
    res.sendStatus(404); // not found
    return;
  }
}