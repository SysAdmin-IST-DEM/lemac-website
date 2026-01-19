import * as controller from './controller.js';
import type { Request, Response } from 'express';
import type { RequestWithBody } from '../../middleware/parseBody.js';
import { type AddPrintTaskBody, EditPrintTaskBody } from '@lemac/data-model';
import { bucket, minio } from '../../services/minio.js';
import path from 'path';
import {
  sendStatusChangedCustomerEmail,
  sendSubmissionCustomerEmail,
  sendSubmissionStaffEmail,
} from '../../services/mail.js';

export async function addPrintingTask(req: RequestWithBody<typeof AddPrintTaskBody>, res: Response) {
  if(!req.file) {
    return res.status(400).json({ error: 'Model file is required' });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const base = path.basename(req.file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
  const filename = `${base}-${Date.now()}${ext}`;

    await minio.putObject(
    bucket,
      filename,
    req.file.buffer,
    req.file.size,
    { "Content-Type": req.file.mimetype }
  );

  const data = await controller.addPrintTask(
    req.file.originalname,
    filename,
    req.body.amount ?? 1,
    req.body.studentName,
    req.body.studentId,
    req.body.email,
    req.body.unit,
    req.body.materialId,
    req.body.price,
    req.body.observations
  );

  console.log(data);

  // Send emails
  await sendSubmissionCustomerEmail(req.body.email, data);
  await sendSubmissionStaffEmail(data);

  return res.json(data);
}

export async function getPrintTasks(req: Request, res: Response) {
  const data = await controller.getPrintingTasks();
  return res.json(data);
}

export async function updatePrintingTask(req: RequestWithBody<typeof EditPrintTaskBody>, res: Response) {
  const id = req.params.id;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  if(req.body.assignedId !== undefined && !req.user!.admin && req.user!.id !== req.body.assignedId) {
    return res.sendStatus(403); // Forbidden - only admins can assign tasks to others
  }

  const before = await controller.getPrintingTask(Number(id));
  if (!before) return res.sendStatus(404);

  const beforeStatus = before.status;

  const data = await controller.editPrintingTask(
    Number(id),
    req.body.name,
    req.body.materialId,
    req.body.status,
    req.body.amount,
    req.body.studentName,
    req.body.studentId,
    req.body.email,
    req.body.unit,
    req.body.price,
    req.body.deadline,
    req.body.observations,
    req.body.assignedId,
    req.body.completedAt
  )

  // Status changed, send email to customer
  if(beforeStatus !== data.status) {
    if(data.status !== 'PENDING' && data.status !== 'WAITING') {
      await sendStatusChangedCustomerEmail(data.email, data);
    }
  }

  res.json(data);
}

export async function dowloadModelFile(req: Request, res: Response) {
  const filename = req.params.filename;

  if (!filename) {
    res.sendStatus(400);
    return;
  }

  const stream = await minio.getObject(bucket, filename);

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`
  );

  stream.on("error", (err) => {
    console.error(err);
    if (!res.headersSent) res.sendStatus(500);
    else res.destroy(err);
  });

  stream.pipe(res);
}