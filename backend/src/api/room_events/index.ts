import { RoomEventType } from '@lemac/data-model';
import * as controller from './controller.js';
import type { Request, Response } from 'express';

const mapType = {
  res_created:  RoomEventType.RES_CREATED,
  res_updated:  RoomEventType.RES_UPDATED,
  res_deleted:  RoomEventType.RES_DELETED,
  key_given:    RoomEventType.KEY_GIVEN,
  key_received: RoomEventType.KEY_RECEIVED,
};

export async function createEvent(req: Request, res: Response) {
  if (req.body && req.body.type && req.body.roomReservationId) {
    const data = await controller.createEvent(
      mapType[req.body.type as keyof typeof mapType],
      req.user!.id,
      req.body.roomReservationId
    );

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getEvents(req: Request, res: Response) {
  const data = await controller.getEvents(new Date(req.query.start as string), new Date(req.query.finish as string));

  if (data.length === 0) {
    res.json([]);
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function editEvent(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (req.body && req.body.type && req.body.roomReservationId) {
    const data = await controller.editEvent(
      mapType[req.body.type as keyof typeof mapType],
      id,
      req.body.roomReservationId,
      req.body.observations
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

export async function deleteEvents(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteEvents(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}