import * as controller from './controller.js';
import * as workstationsController from '../workstations/controller.js';
import type { Request, Response } from 'express';
import { DateTime } from 'luxon';

async function reduceOccupation(entryId: number) {
  const entry = await controller.getEntry(entryId);
  if (entry && entry.active) {
    await workstationsController.changeOccupation(entry.workstationId, -1);
  }
}

export async function addEntry(req: Request, res: Response) {
  if (
    req.body &&
    req.body.istId &&
    req.body.istId.match(/^ist\d+$/) &&
    req.body.workstationId &&
    (await workstationsController.checkWorkstation(req.body.workstationId))
  ) {
    const data = await controller.addEntry(req.body.istId, req.body.workstationId);
    await workstationsController.changeOccupation(req.body.workstationId, 1);

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
    await reduceOccupation(id);
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
  const page = req.query.page ? parseInt(req.query.page as string) : null;
  const itemsPerPage = req.query.itemsPerPage ? parseInt(req.query.itemsPerPage as string) : null;
  const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : null;
  const active = req.query.active ? parseInt(req.query.active as string) === 1 : false;
  const data = await controller.getEntries(active);
  if (data.length === 0) {
    //no entries in db
    res.json([]);
  } else if (data.length > 0) {
    const total = data.length;

    const response = data.map((val: any) => {
      return {
        ...val,
        closedAt: val.closedAt ? DateTime.fromJSDate(val.closedAt).toFormat("HH:mm:ss") : val.closedAt
      };
    });

    if(page && itemsPerPage) {
      // Pagination
      const start = (page - 1) * itemsPerPage
      const end = start + itemsPerPage

      if (sortBy && sortBy.length > 0) {
        // Sorting
        //TODO: fix sorting
      }

      res.json({entries: response.slice(start, end), total});
    } else {
      res.json({entries: response, total});
    }
  } else {
    res.sendStatus(400);
  }
}

export async function deleteEntry(req: Request, res: Response) {
  try {
    if(!req.params.id) {
      res.sendStatus(400);
      return;
    }
    const id = parseInt(req.params.id);
    await reduceOccupation(id);
    if (await controller.deleteEntry(id)) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    res.sendStatus(400);
  }
}
