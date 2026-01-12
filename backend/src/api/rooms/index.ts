import * as controller from './controller.js';
import type { Request, Response } from 'express';

export async function getHoursFenix(req: Request, res: Response) {
  const rooms = {
    SDM: 2448131364045,
    MOM: 2448131364044,
    LTI: 2448131364042,
  };

  let response: any[] = [];

  for (const key in rooms) {
    const data = await controller.getHoursFenix(rooms[key as keyof typeof rooms], req.body.date);
    if (data && data.events) {
      const response_individual = data.events.map((x: any) => {
        let start = x.period.start.split('/');
        start = [start[1], start[0], start[2]];
        start = start.reduce((cur: string, prev: string) => `${cur}${prev}/`, '');

        let end = x.period.end.split('/');
        end = [end[1], end[0], end[2]];
        end = end.reduce((cur: string, prev: string) => `${cur}${prev}/`, '');

        return {
          title: x.type == 'LESSON' ? x.course.acronym : x.title,
          entry: start.slice(0, -1),
          exit: end.slice(0, -1),
          description: x.description,
          room: data.name,
          id: `${data.name}-${start.slice(0, -1)}-${end.slice(0, -1)}`,
        };
      });

      response = [...response, ...response_individual];
    }
  }
  res.json(response);
}

export async function getHours(req: Request, res: Response) {
  const data = await controller.getHours(parseInt(req.query.month as string), parseInt(req.query.year as string));

  if (data.length === 0) {
    res.json([]);
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function addHours(req: Request, res: Response) {
  if (req.body && req.body.entry && req.body.exit) {
    const body = {
      entry: req.body.entry,
      exit: req.body.exit,
    };

    const data = await controller.addHours(
      body,
      req.user!.id,
      req.body.room,
      req.body.name,
      req.body.istId
    );

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function deleteHours(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteHours(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}

export async function updateHours(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (
    req.body &&
    req.body.entry &&
    req.body.exit &&
    req.body.room &&
    req.body.name &&
    req.body.istId
  ) {
    const body = {
      entry: req.body.entry,
      exit: req.body.exit,
    };
    //how to verifie that the hours exists in db
    const data = await controller.updateHours(
      body,
      id,
      req.user!.id,
      req.body.room,
      req.body.name,
      req.body.istId,
      req.body.givenKey
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
