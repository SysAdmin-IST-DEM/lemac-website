import * as controller from './controller.js';
import type { Request, Response } from 'express';

//Functions to convert data types between mysql and javascript json
export async function addHours(req: Request, res: Response) {
  if (
    req.body &&
    req.body.entry &&
    req.body.exit &&
    req.body.entryNumber != null &&
    req.body.safeAmount != null
  ) {
    const body = {
      entry: req.body.entry,
      exit: req.body.exit,
    };

    const data = await controller.addHours(
      body,
      req.user!.id,
      req.body.entryNumber,
      req.body.exitNumber,
      req.body.safeAmount
    );

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getHours(req: Request, res: Response) {
  const data = await controller.getHours(parseInt(req.query.month as string), parseInt(req.query.year as string));
  if (data.length === 0) {
    //no hours in db
    res.json([]);
    return;
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    //bad request
    res.sendStatus(400);
  }
}

export async function updateHours(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (
    req.body &&
    req.body.entry &&
    req.body.exit &&
    req.body.entryNumber != null &&
    req.body.safeAmount != null &&
    req.body.userId
  ) {
    const body = {
      entry: req.body.entry,
      exit: req.body.exit,
    };
    //how to verifie that the hours exists in db
    const data = await controller.updateHours(
      body,
      id,
      req.body.userId,
      req.body.entryNumber,
      req.body.exitNumber,
      req.body.safeAmount
    );
    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getIndividualHours(req: Request, res: Response) {
  const data = await controller.getIndividualHours(req.user!.id);
  if (data.length === 0) {
    //no hours in db
    res.json([]);
    return;
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    //bad request
    res.sendStatus(400);
  }
}

export async function deleteHours(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteHours(id, req.user!.id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}

export async function getSum(req: Request, res: Response) {
  const data = await controller.getSum(req.query.start as string, req.query.finish as string);
  if (data.length === 0) {
    //no hours in db
    res.json([]);
    return;
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    //bad request
    res.sendStatus(400);
  }
}

export async function lastEntry(req: Request, res: Response) {
  const data = await controller.lastEntry();
  if (data) {
    res.json(data);
    return;
  } else {
    res.json([]);
  }
}