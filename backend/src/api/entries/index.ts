import * as controller from './controller.js';
import * as workstationsController from '../workstations/controller.js';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';
import type { Entry } from '@lemac/data-model';

export async function addEntry(req: Request, res: Response) {
  if (
    req.body &&
    req.body.istId &&
    req.body.istId.match(/^ist\d+$/) &&
    req.body.workstationId &&
    (await workstationsController.checkWorkstation(req.body.workstationId))
  ) {
    const data = await controller.addEntry(req.body.istId, req.body.workstationId);

    res.json({
      ...data,
      closedAt: data.closedAt ? DateTime.fromJSDate(data.closedAt).toFormat("HH:mm") : data.closedAt
    });
    return;
  } else {
    res.sendStatus(400);
    return;
  }
}

export async function updateEntry(req: Request, res: Response) {
  if(!req.params.id) {
    res.sendStatus(400);
    return;
  }
  const id = parseInt(req.params.id);

  if (req.body && req.body.active == 1) {
    const prevEntry = await controller.getEntry(id);
    if(!prevEntry) {
      res.sendStatus(404);
      return;
    }

    const data = await controller.updateEntryObservation(
      id,
      req.body.observations,
      req.body.workstationId,
      req.body.istId
    );
    if (!data) {
      res.sendStatus(404);
      return;
    }

    if (prevEntry?.workstationId !== req.body.workstationId) {
      await workstationsController.changeOccupation(prevEntry.workstationId, -1);
      await workstationsController.changeOccupation(req.body.workstationId, 1);
    }

    res.json({
      ...data,
      closedAt: data.closedAt ? DateTime.fromJSDate(data.closedAt).toFormat("HH:mm") : data.closedAt
    });
    return;
  } else if (req.body && req.body.active == 0) {
    const data = await controller.closeEntry(id);
    if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json({
      ...data,
      closedAt: data.closedAt ? DateTime.fromJSDate(data.closedAt).toFormat("HH:mm") : data.closedAt
    });
    return;
  } else {
    res.sendStatus(400);
  }
}

export async function getEntries(req: Request, res: Response) {
  const page = req.query.page ? parseInt(req.query.page as string) : undefined;
  const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage as string) : undefined;
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : undefined;
  const active = req.query.active ? parseInt(req.query.active as string) === 1 : false;

  let orderBy = undefined;
  if(sortBy) {
    orderBy = sortBy.map((s: { key: string, order: 'asc' | 'desc' }) => ({
      [s.key === 'date' ? 'createdAt' : s.key]: s.order
    }));
  }

  console.log("QUERY:", req.query)
  const [data, total] = await controller.getEntries(active, orderBy, page, itemsPerPage);

  if(data.length === 0) {
    res.json([]);
  } else {
    const response = data.map((val: Entry) => {
      return {
        ...val,
        closedAt: val.closedAt ? DateTime.fromJSDate(val.closedAt).toFormat("HH:mm:ss") : val.closedAt
      };
    });
    res.json({ entries: response, total });
  }
}
