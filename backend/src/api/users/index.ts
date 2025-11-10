import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function addUser(req: Request, res: Response) {
  //verifies if the user exists to make sure its authorized to do the operation
  //if the request body has proper structure inserts it db
  if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
    const data = await controller.addUser(req.body);
    if (data === 'ER_DUP_ENTRY') {
      res.status(409).send('duplicate entry');
      return;
    }

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getUsers(req: Request, res: Response) {
  const data = await controller.getUsers();
  if (data.length === 0) {
    //no users in db
    res.json([]);
    return;
  } else if (data.length > 0) {
    const response = data.map((x) => ({
      ...x,
      current: x.id === req.user!.id,
    }));
    res.json(response);
    return;
  } else {
    //bad request
    res.sendStatus(400);
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (req.body && req.body.istId && req.body.istId.match(/^ist\d+$/) && req.body.name) {
    const data = await controller.updateUser(id, req.body);
    //no data found to update
    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function deleteUser(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteUser(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}