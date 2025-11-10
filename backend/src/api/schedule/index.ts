import * as controller from './controller.js';
import type { Request, Response } from 'express';

function date_to_sql(date: string | Date): string {
  const d = new Date(date);

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function createEvent(req: Request, res: Response) {
  if (req.body && req.body.entry && req.body.exit) {
    const data = await controller.createEvent(
      req.body.entry,
      req.body.exit,
      req.body.userId
    );

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getEvents(req: Request, res: Response) {
  const data = await controller.getEvents();

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

  if (req.body && req.body.entry && req.body.exit) {
    //how to verifie that the hours exists in db
    const data = await controller.editEvent(
      req.body.entry,
      req.body.exit,
      req.body.userId,
      id
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

export async function setUserTarget(req: Request, res: Response) {
  if (
    req.body &&
    req.body.date_start !== null &&
    req.body.date_end !== null &&
    req.body.userId !== null &&
    req.body.targetHours !== null
  ) {
    const data = await controller.setUserTargets(
      req.body.targetHours,
      req.body.date_start,
      req.body.date_end,
      req.body.userId
    );

    console.log(data);

    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function editUserTarget(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  if (
    req.body &&
    req.body.date_start !== null &&
    req.body.date_end !== null &&
    req.body.targetHours !== null
  ) {
    const data = await controller.editUserTargets(
      req.body.targetHours,
      req.body.date_start,
      req.body.date_end,
      id
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

export async function deleteTarget(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteTarget(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}

export async function getUserTargets(req: Request, res: Response) {
  const data = await controller.getUserTargets();

  if (data.length === 0) {
    res.json([]);
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function setOffDay(req: Request, res: Response) {
  if (req.body && req.body.date !== null) {
    const data = await controller.setOffDays(date_to_sql(req.body.date));

    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
    return;
  }
  res.sendStatus(400);
}

export async function getOffDays(req: Request, res: Response) {
  const data = await controller.getOffDays();

  if (data.length === 0) {
    res.json([]);
  } else if (data.length > 0) {
    res.json(data);
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function deleteOffDay(req: Request, res: Response) {
  const id = parseInt(req.params.id as string);
  const conf = await controller.deleteOffDay(id);
  if (conf) {
    res.sendStatus(204);
    return;
  } else {
    res.sendStatus(404);
    return;
  }
}